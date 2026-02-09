import { Button } from "../ui/button";


function CommonButton({onClick, buttonText, type, disabled}) {
    
    return (
        <Button
            type={type || "submit"}
            disabled={disabled || null}
            onClick={onClick ||null}
            className="h-10 px-4 bg-black text-white font-extrabold rounded hover:bg-black"
        >
            {buttonText}
        </Button>
    );
}

export default CommonButton;