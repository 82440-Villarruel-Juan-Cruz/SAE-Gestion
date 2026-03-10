import "./Layout.css";
import Navbar from "./Navbar";
import Footer from "./Footer";


export default function MainLayout({ children }) {
  return (
    <div >
      <Navbar />
      <main className="main-content">
        {children}
      </main>
        <Footer/>
    </div>
  );
}