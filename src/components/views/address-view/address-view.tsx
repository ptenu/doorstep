import { Component, Host, h, State, Prop, Fragment } from '@stencil/core';
import { request } from '../../../global/api';
import { RouterHistory, MatchResults } from '@stencil/router';
import state from '../../../global/store';

@Component({
  tag: 'address-view',
  styleUrl: 'address-view.css',
})
export class AddressView {
  @Prop() history: RouterHistory;
  @Prop() match: MatchResults;

  @State() address: any;
  @State() addingNote: boolean = false;

  @State() noteError: string = '';
  @State() noteText: string = '';
  @State() isSensitive: boolean = false;

  @State() responses = {
    answered: null,
  };

  updateResponse(e) {
    const key = e.target.getAttribute('name');
    const value = e.target.value;

    if (key == undefined) {
      return;
    }

    let responses = this.responses;
    responses[key] = value;
    if (key == 'answered') {
      responses[key] = value == 'true';
    }

    this.responses = responses;
  }

  componentWillLoad() {
    this.getAddress();
  }

  getAddress() {
    request
      .get(`/addresses/${this.match.params.uprn}`)
      .then(response => (this.address = response.data))
      .catch(error => (state.errorMessage = error.message));
  }

  back() {
    state.currentAddress = {};
    this.history.push('/addresses');
  }

  save() {
    state.errorMessage = '';
    if (this.responses['answered'] == null) {
      state.errorMessage = 'Did the occuiper answer the door?';
    }

    let responses = this.responses;
    const date = new Date();
    const dateArray = [date.getFullYear(), date.getMonth() + 1, date.getDate()];

    responses['date'] = dateArray;
    this.responses = responses;

    request
      .put(`/addresses/${this.address.uprn}/returns`, this.responses)
      .then(_ => {
        this.back();
      })
      .catch(error => {
        try {
          state.errorMessage = error.response.data.description;
        } catch {
          state.errorMessage = error.message;
        }
      });
  }

  addNote(e) {
    e.preventDefault();
    this.noteError = '';
    if (this.noteText.length < 10) {
      this.noteError = 'Note is too short, please add more text.';
      return;
    }

    request
      .put(`/addresses/${this.address.uprn}/notes`, {
        body: this.noteText,
        internal: true,
        sensitive: this.isSensitive,
      })
      .then(request => {
        this.getAddress();
        this.addingNote = false;
        return request;
      })
      .catch(error => {
        this.noteError = error.message;
      });
  }

  updateNoteText(e) {
    this.noteText = e.target.value;
  }

  render() {
    return (
      <Host>
        <content-container>
          <header class="sticky">
            <h1>Questions</h1>
            <aside class="split">
              <address>{this.address && this.address.multiline && this.address.multiline.map(line => <p>{line}</p>)}</address>
              <text-button onClick={() => (this.addingNote = true)}>Add Note</text-button>
            </aside>
          </header>
          {this.address != undefined && (
            <section>
              {this.address.survey_returns !== undefined && (
                <detail-element label={`Previous data (${this.address.survey_returns.length})`}>
                  {this.address.last_visit == null && (
                    <blockquote>
                      <p>Never contacted</p>
                    </blockquote>
                  )}

                  {this.address.survey_returns.map(r => (
                    <figure>
                      <figcaption>{new Date(r.date).toLocaleDateString()}</figcaption>
                      <dl>
                        <dt>Visited by</dt>
                        <dd>{r.collected_by}</dd>
                        <dt>Answered</dt>
                        <dd>{r.answered.toUpperCase()}</dd>

                        {Object.keys(r.responses).map(key => (
                          <Fragment>
                            {r.responses[key] !== null && (
                              <Fragment>
                                <dt>{key}</dt>
                                <dd>{r.responses[key]}</dd>
                              </Fragment>
                            )}
                          </Fragment>
                        ))}
                      </dl>
                    </figure>
                  ))}
                </detail-element>
              )}

              {this.address.notes !== undefined && (
                <detail-element label={`Notes (${this.address.notes.length})`}>
                  {this.address.notes.map(note => (
                    <figure>
                      <dl>
                        <dt>Added by</dt>
                        <dd>{note.added_by}</dd>
                        <dt>Date</dt>
                        <dd>{new Date(note.date).toLocaleDateString()}</dd>
                        <dt hidden>Note text</dt>
                        <dd class="full">{note.body}</dd>
                      </dl>
                    </figure>
                  ))}
                </detail-element>
              )}
            </section>
          )}

          <section>
            {state.questions.map(question => (
              <field-element label={question.label} useLabel={false}>
                {question.description != null && <p>{question.description}</p>}
                {question.values.map(value => (
                  <cluster-input name={question.name} label={value.label} value={value.value} single onClick={e => this.updateResponse(e)} />
                ))}
              </field-element>
            ))}
          </section>

          <footer class="sticky">
            <button-control theme="light" label="Back" onClick={() => this.back()} />
            <button-control theme="blue" label="Save" onClick={() => this.save()} />
          </footer>
        </content-container>

        <side-panel isOpen={this.addingNote} label="Add Note" closable={false}>
          {this.addingNote && (
            <Fragment>
              <form onSubmit={e => this.addNote(e)}>
                {this.noteError && (
                  <alert-element dismissable={false} theme="danger">
                    {this.noteError}
                  </alert-element>
                )}
                <field-element label="Note text">
                  <textarea name="note-text" onInput={e => this.updateNoteText(e)}></textarea>
                </field-element>
                <p>If you select sensitive the note will only be visible to you and Union Reps.</p>
                <toggle-input name="sensitive" label="Sensitive" onInput={() => (this.isSensitive = !this.isSensitive)} />
              </form>
              <footer>
                <text-button onClick={() => (this.addingNote = false)}>Cancel</text-button>
                <button-control theme="blue" label="Save" tight onClick={e => this.addNote(e)} />
              </footer>
            </Fragment>
          )}
        </side-panel>
      </Host>
    );
  }
}
