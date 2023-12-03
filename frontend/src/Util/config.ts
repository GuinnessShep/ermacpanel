export const apiUrl: string = process.env.REACT_APP_BACKEND_URL as string;

export const getApiUrl = (url: string) => {
    return apiUrl + url;
};

export const getJwtToken = () => {
    return localStorage.getItem("token");
};

export const inputRules = [
    {
        required: true,
        message: "Field can`t be empty",
    },
];

export const customStyles = {
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: "#191c24",
        gap: 0,
        zIndex: 15,
    }),
    input: (provided: any) => ({
        ...provided,
        color: "#ffffff",
    }),
    option: (provided: any, state: { isFocused: boolean; }) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#2e3342" : "#191c24",
        cursor: "pointer",
        margin: 0,
    }),
    group: () => ({}),
    container: () => ({
        backgroundColor: "#191c24",
        cursor: "pointer",
    }),
    control: () => ({
        display: "flex",
        border: "1px solid #2e3342",
        borderRadius: 2,
    }),
    indicatorsContainer: (provided: any) => {
        const borderLeft = "none";
        const padding = "0";

        return {...provided, borderLeft, padding};
    },
    groupHeading: () => ({
        display: "none",
    }),
    singleValue: (provided: any, state: { isDisabled: boolean; }) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = "opacity 300ms";
        const color = "#ffffff";

        return {...provided, opacity, transition, color};
    },
    indicatorSeparator: (provided: any) => ({
        // ...provided,
    }),
    clearIndicator: (provided: any) => ({
        ...provided,
        padding: 5,
    }),
    dropdownIndicator: (provided: any) => ({
        ...provided,
        padding: 5,
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        padding: "0 10px",
    }),
};
