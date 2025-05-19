import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero from "@/components/SecHero/SecHero.jsx" 
import Footer from '@/components/Footer/Footer.jsx'


import CardMember from "@/components/CardMember/CardMember.jsx"

import styles from "./PageOurTeam.module.css"

const PageOurTeam = () => {
    
    
    
    
    return (
        <main>
            <header>
                <Navbar/>
                <SecHero
                    className={styles.coreHero}
                    title="ALUMNI"
                    message="Formal members" 
                    showBtn={false}  
                    btnText="Get Started" 
                    btnLink="/services" 
                />
            </header>

            <div className={styles.content}>
                <CardMember />
                
            </div>
            
            <Footer />

        </main>
        
    )
}
export default PageOurTeam;