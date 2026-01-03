import { Button } from "../ui/button";


function CommonButton({onClick, buttonText, type, disabled}) {
    
    // return (
    //     <div >
           
    //         <div className="flex justify-center">
    //        <Button type={type || "submit"}
    //         disabled={disabled || false}
    //         onClick={onClick || null}
    //         className="flex h-11 justify-center items-center px-5 bg-black font-extrabold text-white border-none rounded hover:bg-black hover:text-white "
            
    //         > {buttonText}</Button>
    //         </div>
    //     </div>
    // )

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