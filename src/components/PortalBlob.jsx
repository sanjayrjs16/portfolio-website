import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function PortalBlob() {
    const [isPortalOpen, setIsPortalOpen] = useState(false);
console.log(isPortalOpen, 'rendering')
    const blobVariants = {
        initial: {
            borderRadius: "62% 47% 82% 35% / 45% 45% 80% 66%",
            width: "21rem",
            height: "450px",
            scale: 1,
        },
        hover: {
            scale: 1.05,
            transition: { duration: 0.3 }
        },
        portal: {
            borderRadius: "0%",
            width: "100vw",
            height: "100vh",
            scale: 1,
            transition: {
                duration: 1,
                ease: "easeInOut"
            }
        }
    };

    const containerVariants = {
        initial: {
            position: "relative",
        },
        portal: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            transition: {
                duration: 0.5
            },
            margin: 'auto',
            textalign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            // padding: 1rem;
            // color: aliceblue;
            // font-size: 3rem;
            // z-index: 50;
        }
    };

    const overlayVariants = {
        initial: {
            opacity: 0
        },
        portal: {
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: 0.5
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="box"
                variants={containerVariants}
                initial="initial"
                animate={isPortalOpen ? "portal" : "initial"}
            >
                <motion.div
                    className="portal-blob"
                    variants={blobVariants}
                    initial="initial"
                    whileHover="hover"
                    animate={isPortalOpen ? "portal" : "initial"}
                    onClick={() => setIsPortalOpen(true)}
                    style={{
                        backgroundImage: "url('https://sanjayrjs.vercel.app/sanjay.jpeg')",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        cursor: "pointer",
                        willChange: "border-radius, transform, opacity",
                        animation: isPortalOpen ? "none" : "sliderShape 5s linear infinite",
                    }}
                />
                {isPortalOpen && (
                    <motion.div
                        variants={overlayVariants}
                        initial="initial"
                        animate="portal"
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.8)",
                            zIndex: 40
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            style={{
                                color: "white",
                                textAlign: "center",
                                padding: "2rem",
                                position: "relative",
                                zIndex: 60
                            }}
                        >
                            <h1>Welcome to the Portal</h1>
                            {console.log(isPortalOpen, 'rendering')}
                            <button 
                                onClick={() => setIsPortalOpen(false)}
                                style={{
                                    padding: "0.5rem 1rem",
                                    margin: "1rem",
                                    background: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Close Portal
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
} 