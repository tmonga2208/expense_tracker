import { useEffect } from "react";
import FeatureComponent from "../components/features";
import { SiteFooter } from "../components/footer";
import { MarqueeDemo } from "../components/Marques2";
import Navbar from "../components/navbar";
import Mockup from "../components/newdevice";
import IconSectionStackedCards from "../components/StackedCards";
import { Button } from "../components/ui/button";

function HomePage() {
    useEffect(() => {
        document.title = "MoneyWise"
    }, []);
    return (
        <>
            <Navbar />
            <div className="">
                <div className="bg-[#3e9c35] flex flex-col sm:flex-row h-[400px] flex w-full overflow-hidden">
                    <div className="w-full sm:w-3/4 flex flex-col justify-center items-center">
                        <div className="flex flex-col p-2 m-4">
                        <h1 className="text-5xl text-white">Take Control of Your Finances with Ease</h1>
                        <p className="text-white m-2">Take control of your finances effortlessly with our Personal Expense Tracker – track daily expenses, manage monthly bills, split costs with friends, and gain powerful insights into your spending habits, all in one place!</p>
                        <div className="h-auto m-2">
                            <Button className="h-auto">Signup</Button>
                        </div>
                        </div>
                     </div>
                <div className="w-full sm:w-1/2 h-full overflow-hidden flex ">
                    <Mockup />
                </div>
                </div>
                <div className="m-2">
                    <IconSectionStackedCards/>
                </div>
                <div className="mt-4 mb-2">
                    <FeatureComponent/>
                </div>
                <div className="">
                    <MarqueeDemo/>
                </div>
            <SiteFooter />
            </div>
        </>
   )
}

export default HomePage;