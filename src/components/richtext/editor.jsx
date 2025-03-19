import { createEffect } from "solid-js";
import { SolidQuill } from "solid-quill";

export default function Editor(props) {
  let quill;

  const handleReady = (editor) => {
    if (props.value) {
      editor.clipboard.dangerouslyPasteHTML(props.value);
    }
  };

  const handleTextChange = () => {
    const html = quill.root.innerHTML;
    props.onUpdate(html);
  };

  createEffect(() => {
    if (quill && props.value !== quill.root.innerHTML) {
      quill.clipboard.dangerouslyPasteHTML(props.value || "");
    }
  });

  return (
    <div class="editor-container">
      <SolidQuill
        ref={quill}
        onReady={handleReady}
        onTextChange={handleTextChange}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        }}
        placeholder={props.placeholder || "Start typing..."}
        style="height: 300px;"
      />
    </div>
  );
}
