import { Form, Formik } from 'formik';
import React from 'react';
import { Modal } from 'react-bootstrap';

import { INotification } from 'core/domain';
import { ModalClose, SubmitButton } from 'core/modal';
import { FormValidator, IModalComponentProps, ReactModal, SpinFormik } from 'core/presentation';

import { NotificationDetails } from './NotificationDetails';

export interface IEditNotificationModalProps extends IModalComponentProps {
  level: string;
  notification: INotification;
  stageType: string;
  editNotification: (n: INotification) => Promise<INotification[]>;
}

export interface IEditNotificationModalState {
  isSubmitting: boolean;
}

export class EditNotificationModal extends React.Component<IEditNotificationModalProps, IEditNotificationModalState> {
  constructor(props: IEditNotificationModalProps) {
    super(props);
    this.state = {
      isSubmitting: false,
    };
  }

  private formikRef = React.createRef<Formik<any>>();

  private submit = (values: INotification): void => {
    this.setState({ isSubmitting: true });
    this.props.editNotification(values).then(() => {
      this.setState({ isSubmitting: false });
      this.props.closeModal();
    });
  };

  public static show(props: any): Promise<INotification> {
    const modalProps = { dialogClassName: 'modal-md' };
    return ReactModal.show(EditNotificationModal, props, modalProps);
  }

  private validate = (values: INotification): any => {
    const formValidator = new FormValidator(values);
    formValidator
      .field('when', 'Notify when')
      .required()
      .withValidators((value: any[]) => !value.length && 'Please select when the notification should execute');
    return formValidator.validateForm();
  };

  public render(): React.ReactElement<EditNotificationModal> {
    const { dismissModal, level, notification, stageType } = this.props;
    return (
      <SpinFormik<INotification>
        ref={this.formikRef}
        initialValues={notification}
        onSubmit={this.submit}
        validate={this.validate}
        render={(formik) => (
          <Form className={`form-horizontal`}>
            <ModalClose dismiss={dismissModal} />
            <Modal.Header>
              <Modal.Title>Edit Notification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className={'row'}>
                <div className="container-fluid modal-body-content">
                  <NotificationDetails formik={formik} level={level} stageType={stageType} />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btn-default" onClick={dismissModal} type="button">
                Cancel
              </button>
              <SubmitButton
                isDisabled={!formik.isValid}
                isFormSubmit={true}
                submitting={false}
                label={'Save Changes'}
              />
            </Modal.Footer>
          </Form>
        )}
      />
    );
  }
}
