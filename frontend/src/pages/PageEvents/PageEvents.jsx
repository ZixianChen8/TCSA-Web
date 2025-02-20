import CardEvent from '@/components/CardEvent/CardEvent.jsx'

import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx" 

import Icon from "@/components/Icon/Icon.jsx"; // Import reusable Icon component

import styles from "./PageEvents.module.css"

const PageEvents = () => {
    //need event fetching logic
    const testIconName = "IconLocation";
    console.log("Passing iconName:", testIconName);
    <Icon iconName={testIconName} color="black" size={24} />;

    return (
        <main>
            <header>
            <Navbar/>
            <SecHero
                title="Events"
                message="yo we got cool events coming up" 
                showBtn={false}  
                btnText="Get Started" 
                btnLink="/services" 
            />


            </header>
        
        <div className={styles.content}>
            <CardEvent/>
            <CardEvent/>
            <CardEvent/>
            <CardEvent/>
            <CardEvent/>

        </div>



        </main>

    )
}

export default PageEvents