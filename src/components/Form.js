import React, { useState, useEffect, Component } from 'react'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import axios from 'axios'

class Form extends Component {

	constructor(props) {
		super(props)

		// Initializing component state with default values
		this.state = {
			CptGrouping: '', // Input field value for CptGrouping
			eventdata: [] // Array to store fetched data from the API
		}
	}

	// Event handler to update CptGrouping value in state when input changes
	handleCptGroupingChange = event => {
		this.setState({
			CptGrouping: event.target.value
		})
	}

	// Event handler for form submission
	handleSubmit = event => {
		event.preventDefault()
		this.setState({eventdata:{}})

		let config = {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'X-Cassandra-Token': process.env.REACT_APP_ASTRA_DB_TOKEN
			}
		}

		// Making a GET request to the Cassandra API based on user input (CptGrouping)
		axios
			.get('https://' + process.env.REACT_APP_ASTRA_DB_ID + '-' + process.env.REACT_APP_ASTRA_DB_REGION + '.apps.astra.datastax.com/api/rest/v2/keyspaces/healthcare/PatientData?where=\{"CptGrouping":{"$eq":"'+ this.state.CptGrouping +'"}}', config)
			.then(response => {
				// Updating eventdata in state with the fetched data from the API response
				this.setState({eventdata: response.data.data})
				console.log(this.state.eventdata)
			})
			.catch(error => {
				console.log(error) // Handling error in case of API request failure
			})
	}

	// Render method to display the form and fetched data in the UI
	render() {
		// Columns configuration for the data grid component
		const columns: GridColDef[] = [
			//Column definitions
		  { field: 'RecordNumber', headerName: 'RecordNumber', width: 250 },
		  { field: 'dimPatientPK', headerName: 'dimPatientPK', width: 250 },
		  { field: 'PatientNumber', headerName: 'PatientNumber', width: 250 },
		  { field: 'FirstName', headerName: 'FirstName', width: 250 },
		  { field: 'LastName', headerName: 'LastName', width: 250 },
		  { field: 'Email', headerName: 'Email', width: 250 },
		  { field: 'PatientGender', headerName: 'PatientGender', width: 250 },
		  { field: 'PatientAge', headerName: 'PatientAge', width: 250 },
		  { field: 'City', headerName: 'City', width: 250 },
		  { field: 'State', headerName: 'State', width: 250 },
		  { field: 'dimPhysicianPK', headerName: 'dimPhysicianPK', width: 250 },
		  { field: 'ProviderNpi', headerName: 'ProviderNpi', width: 250 },
		  { field: 'ProviderName', headerName: 'ProviderName', width: 250 },
		  { field: 'ProviderSpecialty', headerName: 'ProviderSpecialty', width: 250 },
		  { field: 'ProviderFTE', headerName: 'ProviderFTE', width: 250 },
		  { field: 'dimDiagnosisCodePK', headerName: 'dimDiagnosisCodePK', width: 250 },
		  { field: 'DiagnosisCode', headerName: 'DiagnosisCode', width: 250 },
		  { field: 'DiagnosisCodeDescription', headerName: 'DiagnosisCodeDescription', width: 250 },
		  { field: 'dimCptCodePK', headerName: 'dimCptCodePK', width: 250 },
		  { field: 'CptDesc', headerName: 'CptDesc', width: 250 },
		  { field: 'CptGrouping', headerName: 'CptGrouping', width: 250 }
		];

		return (
			<div align='center'>
				{/* Form for user input */}
				<form onSubmit={this.handleSubmit}>
					<div>
						<h1 className='title'>Healthcare</h1>
						{/* Input field for CptGrouping */}
						<label className='label'>CptGrouping</label>
						<input type='text'
							   value={this.state.CptGrouping}
							   onChange={this.handleCptGroupingChange} />
					</div>
					{/* Button to submit the form */}
					<button type="submit">Submit</button>
				</form>
				<br/>
				{/* Data grid component to display fetched data */}
			    <div style={{ height: '80%', width: '80%' }}>
      				<DataGrid
      					rows={this.state.eventdata}
      					columns={columns}
						getRowId={(row) => row.RecordNumber}
      				 />
    			</div>
			</div>
		)
	}
}

export default Form