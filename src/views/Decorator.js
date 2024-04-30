import { CompositeDecorator } from 'draft-js';
import Image from './Image'; // Your custom image component

// Strategy to identify and apply the image decorator
const findImageEntities = (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return entityKey !== null && contentState.getEntity(entityKey).getType() === 'IMAGE';
        },
        callback
    );
};

// Decorator to use in the Draft.js Editor
const decorator = new CompositeDecorator([
    {
        strategy: findImageEntities,
        component: Image,
    },
]);

export default decorator;
