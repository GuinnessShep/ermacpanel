import {AntdIconProps} from "@ant-design/icons/es/components/AntdIcon";

export interface CommandsProps {
    name: string,
    icon: AntdIconProps | HTMLSpanElement,
    action: () => void,
    isDanger?: boolean,
    type?: string,
    quickAccess?: boolean,
    hideInMultiSelect?: boolean,
}

export interface LogButtonsProps extends CommandsProps {
    hasAccess: boolean,
}
