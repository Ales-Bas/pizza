import React from "react"
import ContentLoader from "react-content-loader"

const Skeleton = () => (
    <ContentLoader
        className="pizza-block"
        speed={5}
        width={280}
        height={466}
        viewBox="0 0 280 466"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <circle cx="135" cy="128" r="110" />
        <rect x="0" y="275" rx="10" ry="10" width="280" height="27" />
        <rect x="0" y="316" rx="10" ry="10" width="280" height="88" />
        <rect x="0" y="422" rx="10" ry="10" width="100" height="36" />
        <rect x="155" y="416" rx="30" ry="30" width="121" height="45" />
    </ContentLoader>
)

export default Skeleton;