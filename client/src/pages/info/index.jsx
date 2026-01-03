import { Fragment } from "react";
import { Link } from "react-router-dom";

function Info() {
    return (
        <Fragment>
        <div className="p-6">
            <h1 className="mb-6 text-4xl font-bold text-center">
                About Colors
            </h1>

            {/* SIDE-BY-SIDE BOXES */}
            <div className="flex gap-6 justify-start items-start ml-14">
                <div className="bg-red-400 text-black text-2xl font-semibold h-80 w-80 p-4 ml-8">
                    Red means High Priority Task
                </div>

                <div className="bg-yellow-300 text-black text-2xl font-semibold h-80 w-80 p-4">
                    Yellow means Medium Priority Task
                </div>

                <div className="bg-green-500 text-black text-2xl font-semibold h-80 w-80 p-4">
                    Green means Low Priority Task
                </div>
            </div>

            
        </div>
        </Fragment>
    );
}

export default Info;
