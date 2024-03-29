import React from "react";
import { Label, Box, DropZone, DropZoneItem } from "@adminjs/design-system";

const ImageEditor = (props) => {
  const { property, onChange, record } = props;

  const handleDropZoneChange = (files) => {
    onChange(property.name, files[0]);
  };

  const uploadedPhoto = record.params.profilePhotoLocation;
  const photoToUpload = record.params[property.name];

  return (
    <Box marginBottom="xxl">
      <Label>{property.label}</Label>
      <DropZone onChange={handleDropZoneChange} />
      {uploadedPhoto && !photoToUpload && <DropZoneItem src={uploadedPhoto} />}
    </Box>
  );
};

export default ImageEditor;
