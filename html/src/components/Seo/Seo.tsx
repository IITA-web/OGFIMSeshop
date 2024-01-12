import React from "react";
import { Helmet } from "react-helmet-async";

const SEO: React.FC<any> = ({
  title,
  description,
  name,
  type,
  image,
  keywords,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content={
          keywords ||
          "agriculture marketplace, agricultural products, buy, sell, fresh produce, seeds, livestock, farming equipment, farmers, buyers, ogun state, abeokuta"
        }
      />

      {/* Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:site_name" content={title} />

      {/* Twitter */}
      <meta name="twitter:creator" content={name || title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
