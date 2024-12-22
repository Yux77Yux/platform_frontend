import SettingOptions from "@/src/client-components/setting-options/setting-options.component";
import "./page.scss";
import AvatorUpdate from "@/src/client-components/avator-update/avator-update.component";

const Page = async () => {

    return (
        <div className="setting-page">
            <h2 className="title">
                个人资料
            </h2>

            <div className="avator-update-box">
                <AvatorUpdate />
            </div>

            <div className="setting-box">
                <SettingOptions />
            </div>
        </div>
    );
}

export default Page;