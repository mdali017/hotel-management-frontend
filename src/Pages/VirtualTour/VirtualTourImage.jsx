import React from "react";
import ReactPannellum from "react-pannellum";
import { useParams } from "react-router-dom";
import TourData from "./TourData";

const VirtualTourImage = ({ match  }) => {
    const config = {
        autoRotate: -2,
        autoLoad: true,
    };
    const { id } = useParams();

    if (!id) {
        return <div>No ID parameter provided</div>;
    }

    const selectedImage = TourData.find((image) => image.id.toString() === id);

    if (!selectedImage) {
        return <div>Image not found</div>;
    }

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <ReactPannellum
        id="1"
        sceneId="firstScene"
        imageSource={selectedImage.image}
        config={config}
              style={{
                  width:"100%",
                  // height: `calc(100vh - 123px)`,
              }}
      />
    </div>
  );
};

export default VirtualTourImage;