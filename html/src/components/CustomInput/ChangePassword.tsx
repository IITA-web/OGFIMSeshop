import useStore from "@/store";
import { Modal } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiLoaderAlt } from "react-icons/bi";
import PasswordInput from "./PasswordInput";

interface IChangePassword {
  newPassword: string;
  oldPassword: string;
  confirmNewPassword: string;
}

export const ChangePasswordModal = ({ show, onClose }) => {
  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isValid },
  } = useForm<IChangePassword>();
  const {
    authStore: { processing, clear, isSuccess, changePassword, isFailed },
  } = useStore();

  const watchPassword = watch("newPassword");

  const onSubmit = async (data: IChangePassword) => {
    if (data.newPassword !== data.confirmNewPassword) {
      return;
    }

    await changePassword({
      currentPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  useEffect(() => {
    if (isSuccess || isFailed) {
      if (isSuccess) {
        reset();
      }

      onClose();
    }

    return () => {
      clear("isSuccess", false);
    };
  }, [isSuccess, isFailed]);

  return (
    <Modal
      open={show}
      onCancel={onClose}
      title={null}
      footer={null}
      className="modal"
    >
      <div>
        <h1 className="text-2xl font-medium text-center mx-auto my-6">
          Account Update
        </h1>
        <form
          className="p-4 min-h-[300px] flex flex-col gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label htmlFor="oldPassword" className="block mb-1">
              Current Password
            </label>
            <Controller
              name={"oldPassword"}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <PasswordInput
                    id="oldPassword"
                    name="oldPassword"
                    placeholder="Password"
                    className="form-input"
                    showMeter={false}
                    value={field.value}
                    onChange={(value, name) => field.onChange(value, name)}
                  />
                );
              }}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block mb-1 ">
              New Password
            </label>
            <Controller
              name={"newPassword"}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    placeholder="Password"
                    className="form-input"
                    showMeter
                    value={field.value}
                    onChange={(value, name) => field.onChange(value, name)}
                  />
                );
              }}
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block mb-1 ">
              Confirm New Password
            </label>
            <Controller
              name={"confirmNewPassword"}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => {
                return (
                  <PasswordInput
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    placeholder="Password"
                    className="form-input"
                    showMeter={false}
                    value={field.value}
                    showPasswordMatch
                    passwordMatch={watchPassword}
                    onChange={(value, name) => field.onChange(value, name)}
                  />
                );
              }}
            />
          </div>

          <button
            disabled={processing || !isValid}
            className="btn btn-secondary-2 mt-auto mx-auto"
          >
            {processing ? (
              <BiLoaderAlt className="animate-spin text-white text-xl" />
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
};
