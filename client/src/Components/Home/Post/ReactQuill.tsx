import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ReactQuillComponent({ textValue, setTextValue } : { textValue: string | null, setTextValue: (text: string | '') => void  }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if(textValue){
      setValue(textValue)
    }
  }, [])
  useEffect(() => {
  if(value.length > 0) {
    setTextValue(value)
  }
  else{
    setTextValue('')
  }

}, [value, setTextValue])

useEffect(() => {
  if(textValue) {
    const text = extractTextFromHTML(textValue)
    const textWithoutSpaces = text?.replace(/\s/g, "");
    !textWithoutSpaces && setTextValue('')
  }
}, [textValue])

const extractTextFromHTML = (htmlString: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  const textContent = tempDiv.textContent;
  tempDiv.remove();
  if(!textContent || textContent?.length === 0){
    return null;
  }
  else{
    return textContent;
  }
};

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className="h-[7rem] text-gray-800"
      placeholder="Enter the text..."
    />
  );
}

export default ReactQuillComponent;
