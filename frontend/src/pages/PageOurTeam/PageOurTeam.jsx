import Navbar from "@/components/Navbar/Navbar.jsx"
import SecHero2 from "@/components/SecHero2/SecHero2.jsx" 
import Footer from '@/components/Footer/Footer.jsx'


import CardMember from "@/components/CardMember/CardMember.jsx"

import styles from "./PageOurTeam.module.css"

const PageOurTeam = () => {
    
    
    
    
    return (
        <main>
            <header>
                <Navbar/>
                <SecHero2
                title="MEET THE ALUMNI "
                subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id nisl condimentum, volutpat dolor et, tincidunt tortor. Maecenas finibus est eu justo pulvinar blandit."
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