import Ex1 from "./Ex1";
import Ex2 from "./Ex2";
import React  from "react";
import Ex3 from "./Ex3";
import Ex4 from "./Ex4";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./layout/Layout";
import RLayout from "./layout/RLayout";
import Ex5 from "./Ex5";
import Ex7 from "./Ex7";
import Ex8 from "./Ex8";
import Ex9 from "./Ex9";
import Ex10 from "./Ex10";
import Ex11 from "./Ex11";
import Join from "./Join";
import View from "./View";
import Update from "./Update";
// const App = () => {
//     const [count, setCount] = useState(0);

//     return (
//         <>
//             <Ex2 isLogin={true} name="김태완" />
//             count : {count}
//             <Ex1 ex1="123" ex2="456" />
//             <button onClick={() => setCount(count + 1)}>+1</button>
//             <Ex3/>
//             <Ex4/>
//         </>
//     )
// }


function App() {
    return (
        <BrowserRouter>
      <Routes>
        <Route path="/Ex1" element={<Layout><Ex1 ex1="123" ex2="456" /></Layout>} />
        <Route path="/" element={<RLayout/>}>
        <Route path="/Ex2" element={<Ex2 isLogin={true} name="taewan"/>} />
        <Route path="/Ex3" element={<Ex3 />} />
        <Route path="/Ex4" element={<Ex4 />} />
        </Route>
        <Route path="/Ex5/:id" element={<Layout><Ex5 /></Layout>} />
        <Route path="/*" element={<h1>페이지를 찾을 수 없습니다.</h1>} />
        <Route path="/Ex7" element={<Ex7 />} />
        <Route path="/Ex8" element={<Ex8 />} />
        <Route path="/Ex9" element={<Ex9 />} />
        <Route path="/Ex10" element={<Ex10 />} />
        <Route path="/Ex11" element={<Ex11 />} />
        <Route path="/Join" element={<Join />} />
        <Route path="/View" element={<View />} />
        <Route path="/Update" element={<Update />} />
      </Routes>
    </BrowserRouter>
    )
}
export default App;