import SettingOptions from "@/src/client-components/setting-options/setting-options.component";
import "./page.scss";
import AvatarUpdate from "@/src/client-components/avatar-update/avatar-update.component";

const Page = async () => {

    return (
        <div className="setting-page">
            <h2 className="title">
                个人资料
            </h2>

            <div className="avatar-update-box">
                <AvatarUpdate />
            </div>

            <div className="setting-box">
                <SettingOptions />
            </div>
        </div>
    );
}

export default Page;