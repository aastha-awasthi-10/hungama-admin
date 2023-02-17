import React from "react";
import { ValidatorComponent } from "react-form-validator-core";
import { Input } from 'reactstrap'

class SelectValidator extends ValidatorComponent {
    render() {
        const {
            errorMessages,
            validators,
            requiredError,
            validatorListener,
            ...rest
        } = this.props;

        return (
            <div>
                <Input
                    {...rest}
                    ref={r => {
                        this.input = r;
                    }}
                >
                    {rest.options}
                </Input>
                {this.errorText()}
            </div>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return <div className="text-danger">{this.getErrorMessage()}</div>;
    }
}

export default SelectValidator;
