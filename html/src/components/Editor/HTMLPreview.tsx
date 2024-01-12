function HTMLPreview({ htmlContent }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      className="w-full break-words"
    />
  );
}

export default HTMLPreview;
