import 'react-quill-new/dist/quill.snow.css';

import ReactQuill from 'react-quill-new';

interface QuillEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

const QuillEditor = ({
    content,
    onChange,
    editable = true,
}: QuillEditorProps) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    return (
        <div
            className={`quill-editor-wrapper ${!editable ? 'bg-gray-50' : ''}`}
        >
            <ReactQuill
                theme="snow"
                value={content}
                onChange={onChange}
                modules={modules}
                readOnly={!editable}
            />
        </div>
    );
};

export default QuillEditor;
