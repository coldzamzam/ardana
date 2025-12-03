import { Button } from '@/components/ui/button'; // Assuming you have a Button component
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    editable?: boolean;
}

const TiptapEditor = ({ content, onChange, editable = true }: TiptapEditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'min-h-[150px] p-2 bg-gray-50 focus-visible:outline-none focus-visible:bg-white focus-visible:transition-colors focus-visible:duration-300',
            },
        },
    });

    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    if (!editor) {
        return null;
    }

    return (
        <div className="rounded-md border">
            {editable && (
                <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
                    <Button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Bold
                    </Button>
                    <Button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={
                            !editor.can().chain().focus().toggleItalic().run()
                        }
                        className={editor.isActive('italic') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Italic
                    </Button>
                    <Button
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={
                            !editor.can().chain().focus().toggleStrike().run()
                        }
                        className={editor.isActive('strike') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Strike
                    </Button>
                    <Button
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        disabled={!editor.can().chain().focus().toggleCode().run()}
                        className={editor.isActive('code') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Code
                    </Button>
                    <Button
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className={editor.isActive('paragraph') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Paragraph
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 1 }).run()
                        }
                        className={
                            editor.isActive('heading', { level: 1 })
                                ? 'is-active'
                                : ''
                        }
                        variant="outline"
                        size="sm"
                    >
                        H1
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 2 }).run()
                        }
                        className={
                            editor.isActive('heading', { level: 2 })
                                ? 'is-active'
                                : ''
                        }
                        variant="outline"
                        size="sm"
                    >
                        H2
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().toggleHeading({ level: 3 }).run()
                        }
                        className={
                            editor.isActive('heading', { level: 3 })
                                ? 'is-active'
                                : ''
                        }
                        variant="outline"
                        size="sm"
                    >
                        H3
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Bullet List
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        className={
                            editor.isActive('orderedList') ? 'is-active' : ''
                        }
                        variant="outline"
                        size="sm"
                    >
                        Ordered List
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().toggleCodeBlock().run()
                        }
                        className={editor.isActive('codeBlock') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Code Block
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        className={editor.isActive('blockquote') ? 'is-active' : ''}
                        variant="outline"
                        size="sm"
                    >
                        Blockquote
                    </Button>
                    <Button
                        onClick={() =>
                            editor.chain().focus().setHorizontalRule().run()
                        }
                        variant="outline"
                        size="sm"
                    >
                        Horizontal Rule
                    </Button>
                    <Button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        variant="outline"
                        size="sm"
                    >
                        Undo
                    </Button>
                    <Button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        variant="outline"
                        size="sm"
                    >
                        Redo
                    </Button>
                </div>
            )}
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapEditor;
