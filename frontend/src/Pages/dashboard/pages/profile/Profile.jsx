import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import MySubGreddit from "./MySubGreddit";
import SubGreddit from "./SubGreddit";
import SavedPost from "./SavedPost";
import SubPage from "./SubPage";
import Chats from "./Chats";
import Prof from "./Prof";
import { useParams } from "react-router-dom";
import Error from "../../../Error";

export default function Profile() {
  let { page_val, ops } = useParams();
  console.log(page_val, ops);
  if (localStorage.getItem("greddit_opened_subs") === null) {
    localStorage.setItem("greddit_opened_subs", JSON.stringify({ opened: [] }));
  }
  if (!page_val) page_val = "profile";
  // password - gjzxtgpjyffiaumu
  const pages = [
    "profile",
    "my_subgreddit",
    "subgreddits",
    "saved_posts",
    "chats",
  ];
  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        {page_val === "profile" && <Prof />}
        {page_val === "my_subgreddit" && <MySubGreddit />}
        {page_val === "subgreddits" && <SubGreddit />}
        {page_val === "saved_posts" && <SavedPost />}
        {page_val === "chats" && <Chats />}
        {page_val.startsWith("subgreddit_") && (
          <SubPage sub_page={page_val.slice(11)} ops={ops} init={false} />
        )}
        {!pages.includes(page_val) && !page_val.startsWith("subgreddit_") && (
          <Error text="404 Not Found" />
        )}
      </div>
    </>
  );
}
