import React from 'react';
import { Entity } from 'draft-js';

// Custom component to render an image
const Image = (props) => {
    const entity = Entity.get(props.entityKey);
    const { src, height } = entity.getData();

    return (
        <img
            src={src}
            alt=""
            style={{ height, width:'100%' }}
        />
    );
};

export default Image;
