import React, { useState } from 'react';
import { getBase64 } from '../helpers/imageHelper'; // Importing the getBase64 function

const FileUploadPreview = () => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            getBase64(file).then((base64Image) => {
                setImage(base64Image);
            }).catch(error => {
                console.error("Failed to convert file to base64:", error);
            });
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {image && <img src={image} alt="Preview" style={{ width: '100px', height: 'auto' }} />}
        </div>
    );
};

export default FileUploadPreview;

