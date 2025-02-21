import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx" 

import CardMember from "@/components/CardMember/CardMember.jsx"

import styles from "./PageOurTeam.module.css"

const PageOurTeam = () => {
    
    
    
    
    return (
        <div className="root">
            <header>
                <Navbar/>
                <SecHero
                    title="MEET THE TEAM"
                    message="the gang" 
                    showBtn={false}  
                    btnText="Get Started" 
                    btnLink="/services" 
                />
            </header>

            <div className={styles.content}>
                <CardMember />
            </div>

        </div>
    )
}
export default PageOurTeam;