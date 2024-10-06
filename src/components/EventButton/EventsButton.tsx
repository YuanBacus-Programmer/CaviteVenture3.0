"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const EventsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    router.push("/signup");
  };

  return (
    <>
      <a onClick={handleButtonClick} className="cursor-pointer text-brown-800 text-lg font-serif hover:underline">
        Events
      </a>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <p className="text-lg font-serif mb-4">
              Only signed-in users can see the event page.
            </p>
            <button onClick={handleContinue} style={styles.continueButton}>
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsButton;

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly dark overlay for historical theme
    zIndex: 1000,
  } as const, // Fix for the ESLint error
  modalContent: {
    backgroundColor: "#f8f4e3", // Vintage-style light beige background
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center" as const, // Fix for the ESLint error
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    maxWidth: "400px",
    width: "100%",
    margin: "0 20px",
    fontFamily: "'Garamond', serif", // Use a serif font for a more historical theme
  } as const, // Fix for the ESLint error
  continueButton: {
    marginTop: "10px",
    padding: "10px 20px",
    backgroundColor: "#4b2e13", // Dark brown button color to fit historical theme
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: "'Garamond', serif", // Continue the historical font styling
    fontSize: "16px",
  } as const, // Fix for the ESLint error
};
