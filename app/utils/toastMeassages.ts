import Swal from 'sweetalert2';



export function succesToastMessage({ message }: { message: string }):void {

    Swal.fire({
        position: "top-end",
        icon: "success",
        title: message ,
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        heightAuto: false,
        width: "500px",
        padding: "1em",
        showClass: {
            popup: `
                animate__animated
                animate__slideInRight
                animate__faster
                `
        },
        hideClass: {
            popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
        },
        customClass: {
            icon: 'small-icon'
        }
    });

}

export function failToastMessage({ message }: { message: string }):void {

    Swal.fire({
        position: "top-end",
        icon: "error",
        title: message ,
        toast: true,
        showConfirmButton: false,
        timer: 1500,
        heightAuto: false,
        width: "500px",
        padding: "1em",
        showClass: {
            popup: `
                animate__animated
                animate__slideInRight
                animate__faster
                `
        },
        hideClass: {
            popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
        },
        customClass: {
            icon: 'small-icon'
        }
    });

}

