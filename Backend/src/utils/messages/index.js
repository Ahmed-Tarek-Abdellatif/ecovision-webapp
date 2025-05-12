const genmessage=(entity)=>({
            notFound: `${entity} not found`,
            alreadyExist: `${entity} already exists`,
            createdSuccessfully: `${entity} created successfully`,
            updatedSuccessfully: `${entity} updated successfully`,
            deletedSuccessfully: `${entity} deleted successfully`,
});

export const messages = {
    user:{...genmessage("user"),inaas:"sal;cmasl"},// custom a message to the user
    message:genmessage("message"),
    otp:genmessage("otp"),


};
