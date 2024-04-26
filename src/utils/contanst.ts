// const url = "https://localhost:7156/api"
const url = "https://epplus.azurewebsites.net/api"



export const AUTH = `${url}/Auth/login`;
export const INFORMATION = `${url}/Auth/login/get-user-by-token`;

export const ADMIN = {



    GETALLPRODUCT: `${url}/Product/getAll`,
    DETAILPRODUCT: `${url}/Product/getDetailsById`,
    SEARCHBYNAMEPRODUCT: `${url}/Product/searchbyName`,
    CREATEPRODUCT: `${url}/Product/create`,
    UPDATEPRODUCT: `${url}/Product/update`,



    GETALLUSER: `${url}/User/getAllUser`,
    CREATEUSER: `${url}/User/create`,


    GETALLORDER: `${url}/Order/getAll`,



    UPDATESTATUSORDER: `${url}/Order/updateStatus`,
    GETBYUSERID: `${url}/Order/getorderdetailsbyorderid`,

    CREATEBLOG: `${url}/Blog`,
    GETALLBLOG: `${url}/Blog/getAll`,
    GETALLCATEGORYBLOG: `${url}/Blog/getAllCategoryBlog`,

    GETALLCATEGORIES: `${url}/Category/getall`,


    DASHBOARD: {
        BESTSELLER: `${url}/Order/bestsellerbycategy`,
        TOTALPRICEBYTIME: `${url}/Order/Totalprice`,
    }


}