import Commonform from "../common-form";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";



function CommonDialog({ showDialog,
    onOpenChange,
    title,
    formControls,
    formData,
    handleSubmit,
    btnText }) {

    return (
        <Dialog open={showDialog}
            onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-screen h-[450px] overflow-auto dark:bg-slate-900 dark:border-slate-700">
                <DialogTitle className="dark:text-white">{title}</DialogTitle>
                <div>
                    <Commonform
                        formControls={formControls}
                        form={formData}
                        handleSubmit={handleSubmit}
                        btnText={btnText}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommonDialog;