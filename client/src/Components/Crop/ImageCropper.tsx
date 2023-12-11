import { useCallback, useState } from "react";
import { Button } from "@material-tailwind/react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./CropImage";
import classnames from "classnames";
import { useDispatch } from "react-redux";
import { setTempPostImage } from "../../Redux/PostSlice";

const ImageCropper = ({ image, getImage, aspectRatio }: { image: string, getImage: any, aspectRatio: number } ) => {

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  } | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const dispatch = useDispatch();

  const onCropComplete = useCallback(
    (
      _croppedArea: any,
      croppedAreaPixels: { width: number; height: number; x: number; y: number }
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const showCroppedImage = useCallback(async () => {
    try {
      if (croppedAreaPixels) {
        const croppedBlob: Blob = (await getCroppedImg(
          image,
          croppedAreaPixels,
          rotation
        )) as Blob;
        if (croppedBlob) {
          setCroppedBlob(croppedBlob);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, image]);

  const onClose = useCallback(() => {
    setCroppedBlob(null);
  }, []);

  const onUpdate = useCallback(() => {
    if(aspectRatio === 1.5/1 && croppedBlob){
      dispatch(setTempPostImage(URL.createObjectURL(croppedBlob)))
    }
    getImage(croppedBlob)
  }, [aspectRatio, croppedBlob, dispatch, getImage]);

  return (
    <>
      <div className="flex flex-col">
        <div
          className="z-10 container"
          style={{
            display: image === null || croppedBlob !== null ? "none" : "block",
          }}
        >
          <div className="crop-container z-20">
            <Cropper
              image={image}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              zoomSpeed={4}
              maxZoom={3}
              zoomWithScroll={true}
              showGrid={true}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              cropShape = {aspectRatio === 4/4 ? "round" : "rect"}
            />
          </div>
        </div>
        <Button
          style={{
            display: image === null || croppedBlob !== null ? "none" : "block",
          }}
          onClick={showCroppedImage}
          className="z-30 bg-socioverse-500 text-white"
        >
          Crop
        </Button>
        <div className="cropped-image-container">
          {croppedBlob && (
            <div className="flex item-center justify-center border-4 border-double border-blue-gray-400">
              <img
                className={classnames("cropped-image p-2 ", { " w-full, h-full" : aspectRatio === 4/1}, { "w-[26rem] h-56 md:h-80" : aspectRatio === 1.5/1}, { "w-80 h-80 rounded-full" : aspectRatio === 4/4})}
                src={URL.createObjectURL(croppedBlob)}
                alt="cropped"
              />
            </div>
          )}
          {croppedBlob && (
            <div className="flex items-center justify-start mt-6 gap-4 ">
              <Button
                variant="outlined"
                size="sm"
                className="rounded-full text-black border-black"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-socioverse-500"
                onClick={onUpdate}
              >
                Update
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageCropper;
