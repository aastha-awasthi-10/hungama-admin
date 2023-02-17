
import React, { useState, useEffect } from 'react';
import _ from "lodash";
import ReactDOM from "react-dom";
import Helper from '../../constants/helper';
import apiUrl from '../../constants/apiPath';
import useSession from "react-session-hook";
import { ChartComponent, SeriesCollectionDirective,Category , SeriesDirective, Inject, ColumnSeries, Legend, DateTime, Tooltip, DataLabel, LineSeries,AreaSeries,StepAreaSeries,BarSeries, ControlPoints } from '@syncfusion/ej2-react-charts';
//import { forEach } from 'core-js/fn/array';
//import { dateTimeData } from 'datasource.ts';


const EarningGraph = (props) => {
    const session = useSession();
    const [token] = useState(session.token);
    const [primaryxAxis, setPrimaryxAxis] = useState({});
    const [primaryyAxis, setPrimaryyAxis] = useState({});
    const [item, setItem] = useState('week');
    const [dateTimeData, setDateTimeData] = useState([{ x: new Date().getFullYear() , y: 10000 }]);
   
    let marker = {
        visible: true,
        height: 10, width: 10,
        shape: 'Pentagon',
        dataLabel: { visible: true }
    };

    const getData = async (page = item) => {
        let postJson = { value: page };
        let path = apiUrl.get_admin_earning_graph;
        const fr = await Helper.post(postJson, path, token);
        const res = await fr.response.json();
        if (fr.status === 200) {
            if (res.success) {
                console.log(res.results || []);
                // let rowData = [];
                // rowData = res.results.map(element => {
                //     return { x: element._id, y: element.total }
                // });
                setDateTimeData(res.results);
            } else {
                console.log(res.msg);
            }
        } else {
            console.log(res.error);
        }

    }

    useEffect(() => {
        setItem(props.value);
        getData(props.value);
    }, [props.value]);

    // useEffect(() => {
    //     setPrimaryxAxis({
    //         valueType: 'DateTime', title: _.startCase(_.toLower(item)),intervalType: 'Years', labelPlacement: 'OnTicks',
    //         majorGridLines: { width: 0 }
    //     });
    //     setPrimaryyAxis({  title: 'Earnings in ruppes(Rs)' });
    // }, [props.value]);

    return (
        <ChartComponent id='charts' primaryXAxis={{
                    valueType: 'Category',
                    interval: 1,
                    majorGridLines: { width: 0 },
                    intervalType: 'Years'
                }} primaryYAxis={{  title: 'Earnings in ruppes(Rs)' }} title='Earnings'>
            <Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, LineSeries, DateTime,AreaSeries,StepAreaSeries,BarSeries,Category]} />
            <SeriesCollectionDirective>
                <SeriesDirective dataSource={dateTimeData} xName='x' yName='y' name={_.startCase(_.toLower(item))} type='Column' marker={marker}>
                </SeriesDirective>
            </SeriesCollectionDirective>
        </ChartComponent>
    );

};

export default EarningGraph;

