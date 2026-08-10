import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import CustomerPage from "./pages/customers";
import PaymentsPage from "./pages/payments";

export default function App(){
    return(
        <Router>
            <Routes>
                <Route path="/customers" element={<CustomerPage/>}/>
                <Route path="/payments" element={<PaymentsPage/>}/>
                <Route path="/" element={<CustomerPage/>}/> {/*Default route*/}
            </Routes>
        </Router>
    )
}