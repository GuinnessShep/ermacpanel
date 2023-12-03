import React from "react";
import {Modal} from "antd";
import {ModalsProps} from "../../../Model/Modal";
import {useDispatch} from "react-redux";
import {deleteLog} from "../../../Store/Logs/Actions";

interface DeleteLogProps extends ModalsProps {
    logIds: number[],
}

const DeleteLogModal: React.FC<DeleteLogProps> = (props: DeleteLogProps) => {
    const closeModal = () => {
        props.setVisible(false);
    };

    const dispatch = useDispatch();

    const deleteLogHandle = () => {
        dispatch(deleteLog(props.logIds));

        closeModal();
    };

    return (
        <Modal
            title="Delete?"
            okText="Delete"
            okButtonProps={{danger: true}}
            onOk={deleteLogHandle}
            onCancel={closeModal}
            visible={props.visible}
            destroyOnClose
            width={300}
        >
            This action can`t be undone
        </Modal>
    );
};

export default DeleteLogModal;
