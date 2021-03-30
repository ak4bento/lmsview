import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AssignmentEdit, QuizEdit, ResourceEdit } from '../components/teachableCreate';
import QuizQuestion from '../components/teachableCreate/QuizQuestion';
import QuizQuestionEdit from '../components/teachableCreate/QuizQuestionEdit';
import ServiceAccessor from '../components/ServiceAccessor';
import ActivityIndicator from '../components/ActivityIndicator';
import TeachablesApi from '../api/teachables';


class EditTeachable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            teachable: {}
        }
    }

    render() {

        return (

            <div className="container container-fluid py-4">

                <ServiceAccessor
                    api={TeachablesApi}
                    call={{ type: 'show', id: this.props.match.params.id }}
                    dataType="item"
                    hasData={this.state.teachable.id !== undefined}
                    onValidate={teachable => this.setState({ teachable })}
                    fetchingRender={<ActivityIndicator padded />}>

                    <Switch>
                        <Route path="/classroom/:classroom/teachable/:id/edit/new" component={QuizQuestion} />
                        <Route path="/classroom/:classroom/teachable/:id/edit/:idquestion" component={QuizQuestionEdit} />
                        <Route path="/classroom/:classroom/teachable/:id/edit" render={route => {
                            if (this.state.teachable.id) {
                                switch (this.state.teachable.type) {
                                    case 'resource':
                                        return <ResourceEdit teachable={this.state.teachable} {...route} />
                                    case 'quiz':
                                        return <QuizEdit teachable={this.state.teachable} {...route} />
                                    case 'assignment':
                                        return <AssignmentEdit teachable={this.state.teachable} {...route} />
                                }
                            }

                        }} />

                        <Redirect to={"/classroom/" + this.props.match.params.classroom} />

                    </Switch>

                </ServiceAccessor>

            </div>
        )
    }
}

export default EditTeachable;