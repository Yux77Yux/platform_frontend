import "./page.scss";
import ChunkUploadBox from "./chunk-upload";

const Page = async () => {
    return (
        <div className="manager-page">
            <ChunkUploadBox />
        </div>
    );
}

export default Page;