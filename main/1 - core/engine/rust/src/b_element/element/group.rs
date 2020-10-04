//rust
    use std::rc::Weak;
    use std::cell::RefCell;
    use std::collections::HashMap;

//wasm
    use wasm_bindgen::prelude::*;
    use web_sys::WebGl2RenderingContext;

    #[wasm_bindgen]
    extern "C" {
        // #[wasm_bindgen(js_namespace = console)]
        // fn log(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn warn(a: &str);
        #[wasm_bindgen(js_namespace = console)]
        fn error(a: &str);
    }
    // macro_rules! console_log {
    //     ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
    // }
    macro_rules! console_warn {
        ($($t:tt)*) => (warn(&format_args!($($t)*).to_string()))
    }
    macro_rules! console_error {
        ($($t:tt)*) => (error(&format_args!($($t)*).to_string()))
    }

//core
    use crate::a_library::{
        data_type::{
            Offset,
            Point,
            BoundingBox,
            Polygon,
            Viewbox,
            ElementType,
            Colour,
        },
        math::{
            combine_offsets,
            detect_intersect,
        },
        structure::{
            WebGl2programConglomerateManager,
            ImageRequester,
            FontRequester,
        },
        wasm::from_js_sys::{
            get_value_from_object__f32,
            get_value_from_object__bool,
        },
    };
    use super::super::ElementManager;
    use super::super::element::ElementTrait;
    
    use crate::engine::Engine;








pub struct Group {
    //hierarchy and identity
        element_type: ElementType, 
        id: usize,
        name: String, 
        self_reference: Option<Weak<RefCell<dyn ElementTrait>>>,
        parent: Option<Weak<RefCell<dyn ElementTrait>>>,

    //attributes
        //pertinent to extremity calculation
            x: f32,
            y: f32,
            angle: f32,
            scale: f32,
            heed_camera: bool,
        //other
            ignored: bool,

    //switches
        dot_frame: bool,
        allow_compute_extremities: bool,

    //computed values
        extremities: Polygon,

    //group
        children: Vec<Weak<RefCell<dyn ElementTrait>>>,
        child_registry: HashMap<String,Weak<RefCell<dyn ElementTrait>>>,
        child_id_registry: HashMap<usize,String>,

    //stencil
        clipping_stencil: Option<Weak<RefCell<dyn ElementTrait>>>,
        clipping_active: bool, 
}
impl Group {
    pub fn new(id:usize, name: String) -> Group {
        Group {
            element_type: ElementType::Group,
            id: id,
            name: name,
            self_reference: None,
            parent: None,

            x: 0.0,
            y: 0.0,
            angle: 0.0,
            scale: 1.0,
            heed_camera: false,

            ignored: false,

            dot_frame: false,
            allow_compute_extremities: true,
            
            extremities: Polygon::new_empty(),

            children: vec![],
            child_registry: HashMap::new(),
            child_id_registry: HashMap::new(),

            clipping_stencil: None,
            clipping_active: false,
        }
    }

    //attributes
        //pertinent to extremity calculation
            //heed_camera
                pub fn get_heed_camera(&self) -> bool { self.heed_camera }
                pub fn set_heed_camera(&mut self, new:bool) { self.heed_camera = new; self.compute_extremities(true, None); }
            //unified attribute
                pub fn set_unified_attribute(
                    &mut self,
                    x: Option<f32>,
                    y: Option<f32>,
                    angle: Option<f32>,
                    scale: Option<f32>,
                    heed_camera: Option<bool>,
                    clipping_active: Option<bool>,
                ) {
                    if let Some(x) = x { self.x = x; }
                    if let Some(y) = y { self.y = y; }
                    if let Some(angle) = angle { self.angle = angle; }
                    if let Some(scale) = scale { self.scale = scale; }
                    if let Some(heed_camera) = heed_camera { self.heed_camera = heed_camera; }
                    if let Some(clipping_active) = clipping_active { self.clipping_active = clipping_active; }
                    self.compute_extremities(true, None);
                }

    //group functions
        fn check_for_id(&self, id:usize) -> bool {
            self.child_id_registry.get(&id).is_some()
        }
        fn check_for_name(&self, name:&String) -> bool {
            self.child_registry.contains_key(name)
        }
        fn is_valid_element(&self, element:&Weak<RefCell<dyn ElementTrait>>) -> bool {
            let ele = element.upgrade().unwrap();            
            if ele.borrow().get_name().is_empty() {
                console_error!(
                    "group error: element with no name being inserted into group \"{}\", therefore the element will not be added", 
                    self.get_address()
                );
                return false;
            }
            if self.check_for_name(&ele.borrow().get_name()) {
                console_error!(
                    "group error: element with name \"{}\" already exists in group \"{}\", therefore the element will not be added", 
                    ele.borrow().get_name(), 
                    self.get_address()
                );
                return false;
            }

            true
        }
        fn set_parent_of_child_to_self(&self, em:&ElementManager, new_element:usize) {
            em.get_element_by_id_mut(new_element).unwrap().set_parent(
                ElementManager::clone_weak_reference(self.self_reference.as_ref().unwrap())
            );
        }
        fn get_child_index_by_id(&self, id:usize) -> Option<usize> {
            for (index, child) in self.children.iter().enumerate() {
                if id == child.upgrade().unwrap().borrow().get_id() {
                    return Some(index);
                }
            }
            None
        }

        pub fn children(&self) -> &Vec<Weak<RefCell<dyn ElementTrait>>> { 
            &self.children 
        }
        pub fn get_child_by_name(&self, name:&str) -> Option<usize> {
            if let Some(c) = self.child_registry.get(name) {
                return Some( c.upgrade().unwrap().borrow().get_id() );
            }
            None
        }

        pub fn append(&mut self, em:&ElementManager, new_element:usize) {
            //validate
                if self.check_for_id(new_element) { return; }
                let ele = match em.get_element_weak(new_element) {
                    Some(ele) => ele,
                    None => {
                        console_error!("group:append : invalid id {}, nothing will be added", new_element);
                        return;
                    },
                };
                if !self.is_valid_element(&ele) { return; }

            //update parent of child
                self.set_parent_of_child_to_self(em, new_element);

            //augment extremities
                self.augment_extremities__add(&ele);

            //update the registries
                self.children.push( ElementManager::clone_weak_reference( &ele ) );
                let name = ele.upgrade().unwrap().borrow().get_name().to_string();
                self.child_registry.insert( name.clone(), ele );
                self.child_id_registry.insert(new_element, name);
        }
        pub fn __direct_append(&mut self, new_element:Weak<RefCell<dyn ElementTrait>>) {
            self.augment_extremities__add(&new_element);
            self.children.push( ElementManager::clone_weak_reference( &new_element ) );
            let name = new_element.upgrade().unwrap().borrow().get_name().to_string();
            self.child_registry.insert( name.clone(), new_element );
        }
        pub fn prepend(&mut self, em:&ElementManager, new_element:usize) {
            //validate
                if self.check_for_id(new_element) { return; }
                let ele = match em.get_element_weak(new_element) {
                    Some(ele) => ele,
                    None => {
                        console_error!("group:prepend : invalid id {}, nothing will be added", new_element);
                        return;
                    },
                };
                if !self.is_valid_element(&ele) { return; }

            //update parent of child
                self.set_parent_of_child_to_self(em, new_element);

            //augment extremities
                self.augment_extremities__add(&ele);

            //update the registries
                self.children.insert( 0, ElementManager::clone_weak_reference( &ele ) );
                let name = ele.upgrade().unwrap().borrow().get_name().to_string();
                self.child_registry.insert( name.clone(), ele );
                self.child_id_registry.insert(new_element, name);
        }
        pub fn remove(&mut self, em:&ElementManager, departing_element:usize){
            //validate
                if !self.check_for_id(departing_element) {
                    //check if it's actually the stencil
                    if let Some(clipping_stencil) = &self.clipping_stencil {
                        let ele = em.get_element_weak(departing_element).unwrap();
                        if ele.ptr_eq(&clipping_stencil) {
                            self.clipping_stencil = None;
                            self.clipping_active = false;
                        }
                    }

                    return;
                }

            //update the registries
                let ele = em.get_element_weak(departing_element).unwrap();
                for (index, child) in self.children.iter().enumerate() {
                    if child.ptr_eq(&ele) {
                        self.children.remove( index );
                        break;
                    }
                }

                match self.child_id_registry.get(&departing_element) {
                    None => {},
                    Some(string) => {
                        self.child_registry.remove( string );
                        self.child_id_registry.remove(&departing_element);
                    },
                }

            //augment extremities
                em.get_element_by_id_mut(departing_element).unwrap().clear_parent();
                self.augment_extremities__remove(&ele);
        }
        pub fn clear(&mut self) {
            self.children.clear();
            self.child_id_registry.clear();
            self.child_registry.clear();
            self.compute_extremities(true, None);
        }
        pub fn shift(&mut self, element_to_shift:usize, mut new_position:usize) {
            //check if this element is actually a child
                if !self.check_for_id(element_to_shift) { return; }

            //make sure shift is legal
                if new_position >= self.children.len() {
                    new_position = self.children.len() - 1;
                }

            //classic shift
                let temp = self.children.remove( self.get_child_index_by_id(element_to_shift).unwrap() );
                self.children.insert( new_position, temp );
        }
        pub fn replace_with_these_children(&mut self, em:&ElementManager, new_elements:Vec<usize>) {
            self.clear();

            for new_element in new_elements {
                //validate 
                    if new_element == 0 {
                        //the switch between js and rust seems to interpret 'undefined' as zero. Zero is always the root group, and so shifting doesn't make sense,
                        //It doesn't have a parent, thus there is no group to shift it within. As such, zero can be assume to be an 'undefined' value
                        console_error!("group:replace_with_these_children : id is zero, indicating that the id was undefined. Child will not be added");
                        continue;
                    }

                    let ele = match em.get_element_weak(new_element) {
                        Some(ele) => ele,
                        None => {
                            console_error!("group:replace_with_these_children : invalid id {}, child will not be added", new_element);
                            continue;
                        },
                    };
                    if !self.is_valid_element(&ele) {
                        console_error!("group:replace_with_these_children : invalid element {}, child will not be added", new_element);
                        continue;
                    }

                //update parent of child
                    self.set_parent_of_child_to_self(em, new_element);

                //update the registries
                    self.children.push( ElementManager::clone_weak_reference( &ele ) );
                    let name = ele.upgrade().unwrap().borrow().get_name().to_string();
                    self.child_registry.insert(name.clone(), ele);
                    self.child_id_registry.insert(new_element, name);
            }

            //compute extremities
                self.compute_extremities(true, None);
        }

        pub fn get_elements_under_point(&self, window_point:&Point, point:&Point) -> Vec<usize> {
            let mut return_list:Vec<usize> = vec![];

            //run though children backwards (thus, front to back)
            for index in (0..self.children.len()).rev() {
                let child = self.children[index].upgrade().unwrap();

                //if child wants to be ignored, just move on to the next one
                    if child.borrow().get_ignored() {
                        continue;
                    }

                //things are slightly different if this is the root group
                    if self.id == 0 {
                        if child.borrow().get_element_type() == ElementType::Group {
                            //if the child is not heeding the camera, use the window point
                                let point_of_interest = if child.borrow().as_group().unwrap().get_heed_camera() { point } else { window_point };

                            //if the point is not within this child's bounding box, just move on to the next one
                                if !detect_intersect::point_within_bounding_box(point_of_interest, child.borrow().get_extremities().get_bounding_box() ) {
                                    continue;
                                }
                            //pass this point to the child's "get_elements_under_point" function and collect the results
                                return_list.append( &mut child.borrow().as_group().unwrap().get_elements_under_point(window_point, &point_of_interest) );
                        } else {
                            //by default the root group does not heed the camera. Elements that are not groups are unable to declare that they do, so 
                            //logically they must not heed the camera also

                            //if the point is not within this child's bounding box, just move on to the next one
                                if !detect_intersect::point_within_bounding_box(window_point, child.borrow().get_extremities().get_bounding_box() ) {
                                    continue;
                                }
                            //if this point exists within the child; add it to the results list
                                if detect_intersect::point_within_poly(window_point, child.borrow().get_extremities() ) != detect_intersect::PolySide::Outside {
                                    return_list.push( child.borrow().get_id() );
                                }
                        }
                    } else {
                        //if the point is not within this child's bounding box, just move on to the next one
                            if !detect_intersect::point_within_bounding_box(point, child.borrow().get_extremities().get_bounding_box() ) {
                                continue;
                            }

                        if child.borrow().get_element_type() == ElementType::Group {
                            //pass this point to the child's "get_elements_under_point" function and collect the results
                                return_list.append( &mut child.borrow().as_group().unwrap().get_elements_under_point(window_point, point) );
                        } else {
                            //if this point exists within the child; add it to the results list
                                if detect_intersect::point_within_poly(point, child.borrow().get_extremities() ) != detect_intersect::PolySide::Outside {
                                    return_list.push( child.borrow().get_id() );
                                }
                        }
                    }
            }

            return_list
        }
        pub fn get_elements_under_area(&self, window_polygon:&Polygon, polygon:&Polygon) -> Vec<usize> {
            let mut return_list:Vec<usize> = vec![];

            //run though children backwards (thus, front to back)
            for index in (0..self.children.len()).rev() {
                let child = self.children[index].upgrade().unwrap();

                //if child wants to be ignored, just move on to the next one
                    if child.borrow().get_ignored() {
                        continue;
                    }

                //things are slightly different if this is the root group
                    if self.id == 0 {
                        if child.borrow().get_element_type() == ElementType::Group {
                            //if the child is not heeding the camera, use the window polygon
                                let poly_of_interest = if child.borrow().as_group().unwrap().get_heed_camera() { polygon } else { window_polygon };

                            //if the polygon bounding box does not overlap this child's bounding box, just move on to the next one
                                if !detect_intersect::bounding_boxes(poly_of_interest.get_bounding_box(), child.borrow().get_extremities().get_bounding_box() ) {
                                    continue;
                                }
                            //pass this polygon to the child's "get_elements_under_area" function and collect the results
                                return_list.append( &mut child.borrow().as_group().unwrap().get_elements_under_area(window_polygon, &poly_of_interest) );
                        } else {
                            //by default the root group does not heed the camera. Elements that are not groups are unable to declare that they do, so 
                            //logically they must not heed the camera also

                            //if the polygon bounding box does not overlap this child's bounding box, just move on to the next one
                                if !detect_intersect::bounding_boxes(window_polygon.get_bounding_box(), child.borrow().get_extremities().get_bounding_box() ) {
                                    continue;
                                }
                            //if this polygon overlaps the child; add it to the results list
                                if detect_intersect::poly_on_poly(window_polygon, child.borrow().get_extremities() ).intersect {
                                    return_list.push( child.borrow().get_id() );
                                }
                        }
                    } else {
                        //if the polygon bounding box does not overlap this child's bounding box, just move on to the next one
                            if !detect_intersect::bounding_boxes(polygon.get_bounding_box(), child.borrow().get_extremities().get_bounding_box() ) {
                                continue;
                            }

                        if child.borrow().get_element_type() == ElementType::Group {
                            //pass this polygon to the child's "get_elements_under_area" function and collect the results
                                return_list.append( &mut child.borrow().as_group().unwrap().get_elements_under_area(window_polygon, &polygon) );
                        } else {
                            //if this polygon overlaps the child; add it to the results list
                                if detect_intersect::poly_on_poly(polygon, child.borrow().get_extremities() ).intersect {
                                    return_list.push( child.borrow().get_id() );
                                }
                        }
                    }
            }

            return_list
        }

    //clipping
        pub fn stencil(&mut self, em:&ElementManager, element:usize) {
            self.set_parent_of_child_to_self(em, element);
            self.clipping_stencil = Some( em.get_element_weak(element).unwrap() );
            self.compute_extremities(true, None);
        }
        pub fn get_clip_active(&self) -> bool {
            self.clipping_active
        }
        pub fn set_clip_active(&mut self, new:bool) {
            self.clipping_active = new;
            self.compute_extremities(true, None);
        }

    //extremity calculation
        fn calculate_extremities_box(&mut self, extremities_of_calling_child:Option<&Polygon>, parent_offset:Option<&Offset>) {
            //some very delicate faffery happening here. When updating the values of an element, that element will
            //attempt to update its parent (which is a group element) This parent element will then attempt to update
            //its extremitiesBox. To do so it goes through all it's children collecting their extremitiesBoxes and
            //computes them together. However, this is a double-access of the first element. You see, you mutably borrowed
            //the child to change its value, which causes the parent to borrow the child in order to get that extremity box.
            //  The solution here, is that elements will send their extremitiesBox up with their request to the parent to
            //update. When the parent is collecting the extremitiesBoxes of its children, it will fail on the one that
            //called for the update, at which point it will use the passed extremitiesBox instead.

            fn get_limits(extremities_of_calling_child:&Polygon, child:&Weak<RefCell<dyn ElementTrait>>) -> (f32, f32, f32, f32) {
                let bounding_box_of_calling_child = extremities_of_calling_child.get_bounding_box();

                match child.upgrade().unwrap().try_borrow() {
                    Ok(borrow) => {
                        let bb = borrow.get_extremities().get_bounding_box();
                        (
                            bb.get_top_left().get_x(),
                            bb.get_bottom_right().get_x(),
                            bb.get_top_left().get_y(),
                            bb.get_bottom_right().get_y(),
                        )
                    },
                    Err(_) => {
                        (
                            bounding_box_of_calling_child.get_top_left().get_x(),
                            bounding_box_of_calling_child.get_bottom_right().get_x(),
                            bounding_box_of_calling_child.get_top_left().get_y(),
                            bounding_box_of_calling_child.get_bottom_right().get_y(),
                        )
                    }
                }
            }

            self.extremities = if self.children.len() == 0 {
                match parent_offset {
                    Some(parent_offset) => Polygon::new_from_flat_array(vec![parent_offset.get_x(), parent_offset.get_y()]),
                    None => Polygon::new_empty(),
                }
            } else {
                match extremities_of_calling_child {
                    None => {
                        let tmp = self.children[0].upgrade().unwrap();
                        let borrow = tmp.borrow();
                        let bb = borrow.get_extremities().get_bounding_box();

                        let mut limit_left = bb.get_top_left().get_x();
                        let mut limit_right = bb.get_bottom_right().get_x();
                        let mut limit_top = bb.get_top_left().get_y();
                        let mut limit_bottom = bb.get_bottom_right().get_y();
            
                        for child in self.children.iter().skip(1) {
                            let tmp = child.upgrade().unwrap();
                            let borrow = tmp.borrow();
                            let bb = borrow.get_extremities().get_bounding_box();
                            
                            let tmp_limit_left = bb.get_top_left().get_x();
                            let tmp_limit_right = bb.get_bottom_right().get_x();
                            let tmp_limit_top = bb.get_top_left().get_y();
                            let tmp_limit_bottom = bb.get_bottom_right().get_y();
            
                            if tmp_limit_right > limit_right { limit_right = tmp_limit_right; }
                            if tmp_limit_left < limit_left { limit_left = tmp_limit_left; }
                            if tmp_limit_top < limit_top { limit_top = tmp_limit_top; }
                            if tmp_limit_bottom > limit_bottom { limit_bottom = tmp_limit_bottom; }
                        }
            
                        Polygon::new_from_boundings(limit_left, limit_top, limit_right, limit_bottom, true)
                    },
                    Some(extremities_of_calling_child) => {
                        let (mut limit_left, mut limit_right, mut limit_top, mut limit_bottom) = get_limits(&extremities_of_calling_child, &self.children[0]);
            
                        for child in self.children.iter().skip(1) {
                            let (tmp_limit_left, tmp_limit_right, tmp_limit_top, tmp_limit_bottom) = get_limits(&extremities_of_calling_child, &child);

                            if tmp_limit_right > limit_right { limit_right = tmp_limit_right; }
                            if tmp_limit_left < limit_left { limit_left = tmp_limit_left; }
                            if tmp_limit_top < limit_top { limit_top = tmp_limit_top; }
                            if tmp_limit_bottom > limit_bottom { limit_bottom = tmp_limit_bottom; }
                        }

                        Polygon::new_from_boundings(limit_left, limit_top, limit_right, limit_bottom, true)
                    },
                }
            }
        }
        fn augment_extremities__add(&mut self, new_element:&Weak<RefCell<dyn ElementTrait>>) {
            //combine offset with group's position, angle and scale to produce new offset for children
                let adjusted_offset = combine_offsets(
                    &Offset::new(self.x, self.y, self.scale, self.angle),
                    &self.get_parent_offset(),
                );
            //run computeExtremities on new child
                new_element.upgrade().unwrap().borrow_mut().compute_extremities(false, Some(&adjusted_offset));
            //augment points list
                //if this new element is the only element, just copy the extremities across
                if self.children.len() == 0 {
                    let b_element = new_element.upgrade().unwrap();
                    let b_borrow = b_element.borrow();
                    let b_bb = b_borrow.get_extremities().get_bounding_box();
                    self.extremities = Polygon::new_from_bounding_box( *b_bb, true );
                } else {
                    let a_bb = self.extremities.get_bounding_box();

                    let b_element = new_element.upgrade().unwrap();
                    let b_borrow = b_element.borrow();
                    let b_bb = b_borrow.get_extremities().get_bounding_box();
    
                    let bounding_box = BoundingBox::new_from_points_ref(&[
                        a_bb.get_top_left(), a_bb.get_bottom_right(),
                        b_bb.get_top_left(), b_bb.get_bottom_right(),
                    ]);
                    self.extremities = Polygon::new_from_bounding_box( bounding_box, true );
                }

            //inform parent of change
                match &self.parent {
                    None => {},
                    Some(parent) => {
                        parent.upgrade().unwrap().borrow_mut().as_group_mut().unwrap().update_extremities(true,Some(&self.extremities),None);
                    },
                }
        }
        fn augment_extremities__remove(&mut self, departing_element:&Weak<RefCell<dyn ElementTrait>>) {
            //this function assumes that the element has already been removed from the 'children' variable
            //is the element's bounding box within the bounding box of the group? if so, no recalculation need be done
            //otherwise the element is touching the boundary, in which case search through the children for another 
            //element that also touches the boundary. If you find one you can leave things as they are, otherwise find
            //the closest element and adjust the boundary to touch that

            let self_bb = self.extremities.get_bounding_box();

            let de_element = departing_element.upgrade().unwrap();
            let de_borrow = de_element.borrow();
            let de_bb = de_borrow.get_extremities().get_bounding_box();

            let data = BoundingBox::new(
                self_bb.get_top_left().get_x() - de_bb.get_top_left().get_x(),
                self_bb.get_top_left().get_y() - de_bb.get_top_left().get_y(),
                de_bb.get_bottom_right().get_x() - self_bb.get_bottom_right().get_x(),
                de_bb.get_bottom_right().get_y() - self_bb.get_bottom_right().get_y(),
            );

            if 
                data.get_top_left().get_x() != 0.0 && 
                data.get_top_left().get_y() != 0.0 && 
                data.get_bottom_right().get_x() != 0.0 && 
                data.get_bottom_right().get_y() != 0.0 
            {
                //easy remove; no changes to the group's bounding box required
                return;
            } else {
                let mut new_topLeft_x = self_bb.get_top_left().get_x();
                let mut new_topLeft_y = self_bb.get_top_left().get_y();
                let mut new_bottomRight_x = self_bb.get_bottom_right().get_x();
                let mut new_bottomRight_y = self_bb.get_bottom_right().get_y();

                //topLeft x
                    if data.get_top_left().get_x() == 0.0 { //is at boundary
                        let mut boundaryToucherFound = false;
                        let mut closestToBoundary_distance:Option<f32> = None;
                        let mut closestToBoundary_position:f32 = 0.0;
                        for child in self.children.iter() {
                            let child = child.upgrade().unwrap();
                            let tmp = ( de_bb.get_top_left().get_x() - self_bb.get_top_left().get_x() ).abs();

                            if closestToBoundary_distance.is_none() || closestToBoundary_distance.unwrap() > tmp {
                                closestToBoundary_distance = Some(tmp);
                                closestToBoundary_position = child.borrow().get_extremities().get_bounding_box().get_top_left().get_x();
                                if closestToBoundary_distance.unwrap() == 0.0 { 
                                    boundaryToucherFound = true;
                                    break;
                                }
                            }
                        }
                        if !boundaryToucherFound { //need to adjust the bounding box
                            new_topLeft_x = closestToBoundary_position;
                        }
                    }
                //topLeft y
                    if data.get_top_left().get_y() == 0.0 { //is at boundary
                        let mut boundaryToucherFound = false;
                        let mut closestToBoundary_distance:Option<f32> = None;
                        let mut closestToBoundary_position:f32 = 0.0;
                        for child in self.children.iter() {
                            let child = child.upgrade().unwrap();
                            let tmp = ( de_bb.get_top_left().get_y() - self_bb.get_top_left().get_y() ).abs();

                            if closestToBoundary_distance.is_none() || closestToBoundary_distance.unwrap() > tmp {
                                closestToBoundary_distance = Some(tmp);
                                closestToBoundary_position = child.borrow().get_extremities().get_bounding_box().get_top_left().get_y();
                                if closestToBoundary_distance.unwrap() == 0.0 { 
                                    boundaryToucherFound = true;
                                    break;
                                }
                            }
                        }
                        if !boundaryToucherFound { //need to adjust the bounding box
                            new_topLeft_y = closestToBoundary_position;
                        }
                    }
                //bottomRight x
                    if data.get_bottom_right().get_x() == 0.0 { //is at boundary
                        let mut boundaryToucherFound = false;
                        let mut closestToBoundary_distance:Option<f32> = None;
                        let mut closestToBoundary_position:f32 = 0.0;
                        for child in self.children.iter() {
                            let child = child.upgrade().unwrap();
                            let tmp = ( de_bb.get_bottom_right().get_x() - self_bb.get_bottom_right().get_x() ).abs();

                            if closestToBoundary_distance.is_none() || closestToBoundary_distance.unwrap() > tmp {
                                closestToBoundary_distance = Some(tmp);
                                closestToBoundary_position = child.borrow().get_extremities().get_bounding_box().get_bottom_right().get_x();
                                if closestToBoundary_distance.unwrap() == 0.0 { 
                                    boundaryToucherFound = true;
                                    break;
                                }
                            }
                        }
                        if !boundaryToucherFound { //need to adjust the bounding box
                            new_bottomRight_x = closestToBoundary_position;
                        }
                    }
                //bottomRight y
                    if data.get_bottom_right().get_y() == 0.0 { //is at boundary
                        let mut boundaryToucherFound = false;
                        let mut closestToBoundary_distance:Option<f32> = None;
                        let mut closestToBoundary_position:f32 = 0.0;
                        for child in self.children.iter() {
                            let child = child.upgrade().unwrap();
                            let tmp = ( de_bb.get_bottom_right().get_y() - self_bb.get_bottom_right().get_y() ).abs();

                            if closestToBoundary_distance.is_none() || closestToBoundary_distance.unwrap() > tmp {
                                closestToBoundary_distance = Some(tmp);
                                closestToBoundary_position = child.borrow().get_extremities().get_bounding_box().get_bottom_right().get_y();
                                if closestToBoundary_distance.unwrap() == 0.0 { 
                                    boundaryToucherFound = true;
                                    break;
                                }
                            }
                        }
                        if !boundaryToucherFound { //need to adjust the bounding box
                            new_bottomRight_y = closestToBoundary_position;
                        }
                    }

                //assemble new values together
                    self.extremities = Polygon::new_from_boundings(
                        new_topLeft_x, new_topLeft_y, new_bottomRight_x, new_bottomRight_y,
                        true
                    );
            }
        }
        pub fn update_extremities(&mut self, inform_parent:bool, extremities_of_calling_child:Option<&Polygon>, parent_offset:Option<&Offset>) {
            //if clipping is active and possible, the extremities of this group are limited to those of the clipping element
            //otherwise, gather extremities from children and calculate extremities here
            if self.clipping_active && self.clipping_stencil.is_some() {
                self.extremities = self.clipping_stencil.as_ref().unwrap().upgrade().unwrap().borrow().get_extremities().clone();
            } else {
                self.calculate_extremities_box(extremities_of_calling_child, parent_offset);
            };

            //update parent
                if inform_parent { 
                    match &self.parent {
                        None => {},
                        Some(parent) => {
                            parent.upgrade().unwrap().borrow_mut().as_group_mut().unwrap().update_extremities(
                                true,
                                Some( &self.extremities ),
                                None,
                            );
                        },
                    }
                }
        }
}
impl ElementTrait for Group {
    //trait requirements
        //hierarchy and identity
            fn get_element_type(&self) -> ElementType { self.element_type }
            fn get_id(&self) -> usize { self.id }
            fn get_name(&self) -> &String{ &self.name }
            fn set_name(&mut self, new:String) { self.name = new; }
            fn set_self_reference(&mut self, new:Weak<RefCell<dyn ElementTrait>>) { self.self_reference = Some(new); }
            fn get_parent(&self) -> &Option<Weak<RefCell<dyn ElementTrait>>> { &self.parent }
            fn set_parent(&mut self, new:Weak<RefCell<dyn ElementTrait>>) { self.parent = Some(new); }
            fn clear_parent(&mut self) { self.parent = None; }

        //position
            //x
                fn get_x(&self) -> f32 { self.x }
                fn set_x(&mut self, new:f32){ self.x = new; }
            //y
                fn get_y(&self) -> f32 { self.y }
                fn set_y(&mut self, new:f32){ self.y = new; }
            //angle
                fn get_angle(&self) -> f32 { self.angle }
                fn set_angle(&mut self, new:f32) { self.angle = new; }
            //scale
                fn get_scale(&self) -> f32 { self.scale }
                fn set_scale(&mut self, new:f32) { self.scale = new; }

        //other
            fn get_ignored(&self) -> bool { self.ignored }
            fn set_ignored(&mut self, new:bool) { self.ignored = new; }

        //extremities
            fn get_allow_compute_extremities(&self) -> bool { self.allow_compute_extremities }
            fn set_allow_compute_extremities(&mut self, new:bool) { self.allow_compute_extremities = new; }
            fn get_extremities(&self) -> &Polygon { &self.extremities }
            fn __set_extremities(&mut self, new:Polygon) { self.extremities = new; }

        //render
            fn get_dot_frame(&self) -> bool { self.dot_frame }
            fn set_dot_frame(&mut self, new:bool) { self.dot_frame = new; }

    //element specific
        //casting
            fn as_group(&self) -> Option<&Group> { Some(self) }
            fn as_group_mut(&mut self) -> Option<&mut Group> { Some(self) }

        //universal attribute
            fn set_unified_attribute_from_js_sys_object(&mut self, unified_attribute:js_sys::Object, _font_requester:&RefCell<FontRequester>, _worker:&web_sys::Worker) {
                self.set_unified_attribute(
                    get_value_from_object__f32( "x", &unified_attribute, true ),
                    get_value_from_object__f32( "y", &unified_attribute, true ),
                    get_value_from_object__f32( "angle", &unified_attribute, true ),
                    get_value_from_object__f32( "scale", &unified_attribute, true ),
                    get_value_from_object__bool( "heedCamera", &unified_attribute, true ),
                    get_value_from_object__bool( "clipActive", &unified_attribute, true ),
                );
            }

        //extremities
            fn compute_extremities(&mut self, inform_parent:bool, offset:Option<&Offset>) {
                if !self.allow_compute_extremities { return; }

                //get offset from parent, if one isn't provided
                    let _default_offset;
                    let offset = if offset.is_none() {
                        _default_offset = self.get_parent_offset();
                        &_default_offset
                    } else {
                        offset.unwrap()
                    };
                //combine offset with group's position, angle and scale to produce new offset for children
                    let adjusted_offset = combine_offsets(
                        &Offset::new(self.x, self.y, self.scale, self.angle),
                        offset,
                    );
                //run computeExtremities on all children
                    for child in self.children.iter() {
                        child.upgrade().unwrap().borrow_mut().compute_extremities(false, Some(&adjusted_offset))
                    }
                //run computeExtremities on stencil (if applicable)
                    match &self.clipping_stencil {
                        None => {},
                        Some(stencil) => {
                            stencil.upgrade().unwrap().borrow_mut().compute_extremities(false, Some(&adjusted_offset));
                        },
                    }
                //update extremities
                    self.update_extremities(inform_parent, None, Some(&adjusted_offset));
            }

        //render
            fn render(
                &mut self,
                parent_id: Option<&usize>,
                parent_clipping_polygon: Option<&Polygon>,
                heed_camera: Option<bool>,
                offset: &Offset,
                viewbox: &Viewbox,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
                force:bool,
            ) {
                //if there's no children, then don't worry about it
                    if self.children.len() == 0 {
                        return;
                    }

                //determine if this group is a child of the root
                    let child_of_the_root = parent_id == Some(&0);

                //use the local heed_camera value if this is a child of the root, otherwise pass forward the argument
                    let heed_camera = if child_of_the_root {
                        self.heed_camera
                    } else {
                        heed_camera.unwrap() //should always have a value (probably should remove option)
                    };

                //judge whether this element should be allowed to render
                    if !force && self.get_id() != 0 && !self.should_this_element_render( parent_clipping_polygon, viewbox, Some(heed_camera) ) {
                        return;
                    }
                
                //if this element is heeding the camera; combine offset with shape's position, angle and scale to produce adjust value for render
                    let adjusted_offset = if self.id == 0 {
                        Offset::new(self.x, self.y, self.scale, self.angle)
                    } else if child_of_the_root && !heed_camera {
                        Offset::new(self.x, self.y, self.scale, self.angle)
                    } else if child_of_the_root && heed_camera {
                        viewbox.get_offset()
                    } else {
                        combine_offsets(
                            &Offset::new(self.x, self.y, self.scale, self.angle),
                            offset,
                        )
                    };

                //activate clipping (if requested, and is possible)
                    if self.clipping_active && self.clipping_stencil.is_some() {
                        //active stencil drawing mode
                            context.enable(WebGl2RenderingContext::STENCIL_TEST);
                            context.color_mask(false, false, false, false);
                            context.stencil_func(WebGl2RenderingContext::ALWAYS, 1, 0xFF);
                            context.stencil_op(WebGl2RenderingContext::KEEP, WebGl2RenderingContext::KEEP, WebGl2RenderingContext::REPLACE);
                            context.stencil_mask(0xFF);
                        //draw stencil
                            self.clipping_stencil.as_ref().unwrap().upgrade().unwrap().borrow_mut().render(
                                Some(&self.id),
                                Some(&self.extremities),
                                Some(heed_camera),
                                &adjusted_offset,
                                viewbox,
                                context,
                                web_gl2_program_conglomerate_manager,
                                image_requester,
                                resolution,
                                force,
                            );
                        //reactive regular rendering
                            context.color_mask(true, true, true, true);
                            context.stencil_func(WebGl2RenderingContext::EQUAL, 1, 0xFF);
                    }

                //render children
                    let parent_bounding_box__argument = if self.clipping_active { Some(&self.extremities) } else { None };
                    for child in self.children.iter() {
                        child.upgrade().unwrap().borrow_mut().render(
                            Some(&self.id),
                            parent_bounding_box__argument,
                            Some(heed_camera),
                            &adjusted_offset,
                            viewbox,
                            context,
                            web_gl2_program_conglomerate_manager,
                            image_requester,
                            resolution,
                            force,
                        );
                    }

                //deactivate clipping
                    if self.clipping_active { 
                        context.disable(WebGl2RenderingContext::STENCIL_TEST); 
                        context.clear(WebGl2RenderingContext::STENCIL_BUFFER_BIT);
                    }

                //if requested; draw dot frame
                    if self.dot_frame {
                        self.draw_dot_frame(
                            parent_clipping_polygon,
                            Some(heed_camera),
                            viewbox,
                            context,
                            web_gl2_program_conglomerate_manager,
                            image_requester,
                            resolution,
                        );
                    }
            }
            fn draw_dot_frame(
                &self,
                parent_clipping_polygon: Option<&Polygon>,
                heed_camera: Option<bool>,
                viewbox: &Viewbox,
                context: &WebGl2RenderingContext, 
                web_gl2_program_conglomerate_manager: &mut WebGl2programConglomerateManager,
                image_requester: &mut ImageRequester,
                resolution: &(u32, u32),
            ) {
                let mux:f32 = 1.0; //0.05;

                //draw bounding box top left and bottom right points
                    ElementManager::draw_dot(
                        &self.extremities.get_bounding_box().get_top_left(), 6.0 * mux, &Colour::new(0.0,1.0,1.0,0.5), 
                        parent_clipping_polygon, heed_camera, &viewbox.get_offset(), viewbox, context, web_gl2_program_conglomerate_manager, image_requester, resolution
                    );
                    ElementManager::draw_dot(
                        &self.extremities.get_bounding_box().get_bottom_right(), 6.0 * mux, &Colour::new(0.0,1.0,1.0,0.5), 
                        parent_clipping_polygon, heed_camera, &viewbox.get_offset(), viewbox, context, web_gl2_program_conglomerate_manager, image_requester, resolution
                    );
            }

        //info/dump
            fn _specific_info(&self) -> String {
                let mut children:String = String::from("[");
                for (index, child) in self.children.iter().enumerate() {
                    children = format!("{}{}", children, child.upgrade().unwrap().borrow().get_id());
                    if index != self.children.len()-1 { children = format!("{},", children); }
                }
                children = format!("{}]", children);

                format!(
                    "heed_camera:{}, children:{}, clipping_stencil_id:{}, clipping_stencil_name:{}, clipping_active:{}",

                    self.heed_camera,

                    children,

                    match &self.clipping_stencil { Some(a) => a.upgrade().unwrap().borrow().get_id().to_string(), None => "-none-".to_string() },
                    match &self.clipping_stencil { Some(a) => a.upgrade().unwrap().borrow().get_name().to_string(), None => "-none-".to_string() },
                    self.clipping_active,
                )
            }
}

impl ElementManager {
    fn check_is_group(&self, id:usize, calling_function_name:&str) -> bool {
        match self.get_element_type_by_id(id) {
            Some(element_type) => {
                if element_type == ElementType::Group {
                    return true;
                } else {
                    console_warn!("element:{} : element with id \"{}\" is not a group", calling_function_name, id);
                    return false;
                }
            },
            None => {
                console_warn!("element:{} : element with id \"{}\" not found", calling_function_name, id);
                return false;
            },
        }
    }

    pub fn execute_method__Group__set_unified_attribute(
        &mut self, id:usize,
        x:Option<f32>, y:Option<f32>,
        angle:Option<f32>,
        scale:Option<f32>,
        heed_camera:Option<bool>,
        clipping_active:Option<bool>,
    ) {
        if !self.check_is_group(id, "execute_method__Group__set_unified_attribute") { return; }
        self.get_element_by_id_mut(id).unwrap().as_group_mut().unwrap().set_unified_attribute( x, y, angle, scale, heed_camera, clipping_active );
    }

    pub fn execute_method__Group__children(&self, id:usize) -> Option<Vec<usize>> {
        if !self.check_is_group(id, "execute_method__Group__children") { return None; }
        Some( self.get_element_by_id(id).unwrap().as_group().unwrap().children().iter().map(|child| child.upgrade().unwrap().borrow().get_id() ).collect() )
    } 
    pub fn execute_method__Group__get_child_by_name(&self, id:usize, name:&str) -> Option<usize> {
        if !self.check_is_group(id, "execute_method__get_child_by_name") { return None; }
        self.get_element_by_id(id).unwrap().as_group().unwrap().get_child_by_name(name)
    }

    pub fn execute_method__Group__append(&self, parent_id:usize, child_id:usize) {
        if !self.check_is_group(parent_id, "execute_method__Group__append") { return; }
        self.get_element_by_id_mut(parent_id).unwrap().as_group_mut().unwrap().append( self, child_id );
    }
    pub fn execute_method__Group__prepend(&self, parent_id:usize, child_id:usize) {
        if !self.check_is_group(parent_id, "execute_method__Group__prepend") { return; }
        self.get_element_by_id_mut(parent_id).unwrap().as_group_mut().unwrap().prepend( self, child_id );
    }
    pub fn execute_method__Group__remove(&self, parent_id:usize, child_id:usize) {
        if !self.check_is_group(parent_id, "execute_method__Group__remove") { return; }
        self.get_element_by_id_mut(parent_id).unwrap().as_group_mut().unwrap().remove( self, child_id );
    }
    pub fn execute_method__Group__clear(&self, parent_id:usize) {
        if !self.check_is_group(parent_id, "execute_method__Group__clear") { return; }
        self.get_element_by_id_mut(parent_id).unwrap().as_group_mut().unwrap().clear();
    }
    pub fn execute_method__Group__shift(&self, parent_id:usize, child_id:usize, new_position:usize) {
        if !self.check_is_group(parent_id, "execute_method__Group__shift") { return; }
        self.get_element_by_id_mut(parent_id).unwrap().as_group_mut().unwrap().shift(child_id, new_position);
    }
    pub fn execute_method__Group__replace_with_these_children(&self, id:usize, new_elements:Vec<usize>) {
        if !self.check_is_group(id, "execute_method__replace_with_these_children") { return; }
        self.get_element_by_id_mut(id).unwrap().as_group_mut().unwrap().replace_with_these_children(self, new_elements);
    }

    pub fn execute_method__Group__get_elements_under_point(&self, id:usize, point:&Point) -> Vec<usize> {
        if !self.check_is_group(id, "execute_method__Group__get_elements_under_point") { return vec![]; }
        self.get_element_by_id(id).unwrap().as_group().unwrap().get_elements_under_point(point, point)
    }
    pub fn execute_method__Group__get_elements_under_area(&self, id:usize, polygon:&Polygon) -> Vec<usize> {
        if !self.check_is_group(id, "execute_method__Group__get_elements_under_area") { return vec![]; }
        self.get_element_by_id(id).unwrap().as_group().unwrap().get_elements_under_area(polygon, polygon)
    }

    pub fn execute_method__Group__stencil(&self, id:usize, new_stencil_id:usize) {
        if !self.check_is_group(id, "execute_method__Group__stencil") { return; }
        self.get_element_by_id_mut(id).unwrap().as_group_mut().unwrap().stencil(self, new_stencil_id);
    }
    pub fn execute_method__Group__get_clip_active(&self, id:usize) -> Option<bool> {
        if !self.check_is_group(id, "execute_method__Group__get_clip_active") { return None; }
        Some( self.get_element_by_id(id).unwrap().as_group().unwrap().get_clip_active() )
    }
    pub fn execute_method__Group__set_clip_active(&mut self, id:usize, new:bool) {
        if !self.check_is_group(id, "execute_method__Group__set_clip_active") { return; }
        self.get_element_by_id_mut(id).unwrap().as_group_mut().unwrap().set_clip_active(new);
    }
}

#[wasm_bindgen]
impl Engine {
    pub fn element__execute_method__Group__set_unified_attribute(
        &mut self, id:usize,
        x:Option<f32>, y:Option<f32>,
        angle:Option<f32>,
        scale:Option<f32>,
        heed_camera:Option<bool>,
        clipping_active:Option<bool>,
    ) {
        self.element_manager.execute_method__Group__set_unified_attribute(
            id,
            x, y,
            angle,
            scale,
            heed_camera,
            clipping_active,
        );
    }

    pub fn element__execute_method__Group__children(&self, id:usize) -> Option<Vec<usize>> {
        self.element_manager.execute_method__Group__children(id)
    }
    pub fn element__execute_method__Group__get_child_by_name(&self, id:usize, name:&str) -> Option<usize> {
        self.element_manager.execute_method__Group__get_child_by_name(id, name)
    }

    pub fn element__execute_method__Group__append(&self, parent_id:usize, child_id:usize) {
        self.element_manager.execute_method__Group__append(parent_id, child_id);
    }
    pub fn element__execute_method__Group__prepend(&self, parent_id:usize, child_id:usize) {
        self.element_manager.execute_method__Group__prepend(parent_id, child_id);
    }
    pub fn element__execute_method__Group__remove(&self, parent_id:usize, child_id:usize) {
        self.element_manager.execute_method__Group__remove(parent_id, child_id);
    }
    pub fn element__execute_method__Group__clear(&self, parent_id:usize) {
        self.element_manager.execute_method__Group__clear(parent_id);
    }
    pub fn element__execute_method__Group__shift(&self, parent_id:usize, child_id:usize, new_position:usize) {
        self.element_manager.execute_method__Group__shift(parent_id, child_id, new_position);
    }
    pub fn element__execute_method__Group__replace_with_these_children(&self, id:usize, new_elements:Vec<usize>) {
        self.element_manager.execute_method__Group__replace_with_these_children(id, new_elements);
    }

    pub fn element__execute_method__Group__get_elements_under_point(&self, id:usize, x:f32, y:f32) -> Vec<usize> {
        self.element_manager.execute_method__Group__get_elements_under_point(id, &Point::new(x,y))
    }
    pub fn element__execute_method__Group__get_elements_under_area(&self, id:usize, polygon:Vec<f32>) -> Vec<usize> {
        self.element_manager.execute_method__Group__get_elements_under_area(id, &Polygon::new_from_flat_array(polygon))
    }

    pub fn element__execute_method__Group__stencil(&self, id:usize, new_stencil_id:usize) {
        self.element_manager.execute_method__Group__stencil(id, new_stencil_id);
    }
    pub fn element__execute_method__Group__get_clip_active(&self, id:usize) -> Option<bool> {
        self.element_manager.execute_method__Group__get_clip_active(id)
    }
    pub fn element__execute_method__Group__set_clip_active(&mut self, id:usize, new_bool:bool) {
        self.element_manager.execute_method__Group__set_clip_active(id, new_bool);
    }
}