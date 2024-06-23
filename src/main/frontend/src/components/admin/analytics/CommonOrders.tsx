import ReactECharts from 'echarts-for-react';
import { useSingleFetch } from '../../../hooks/useSingleFetch';
import { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode } from '@chakra-ui/react';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { useFetch } from '../../../hooks/useFetch';
import { ChartData } from './AnalyticsDashboard';


const CommonOrders = () => {
	const isDesktop = useMatchMedia();
	const { colorMode } = useColorMode();
	const [tabIndex, setTabIndex] = useState(0);
	const [url, setUrl] = useState("");
	const { data: sectors } = useFetch<Sector>("/api/v1/product-management/sector");
	const [sector, setSector] = useState("");
	const { data: topRequestedOrders, error: errorFromStatuses } = useFetch<OrderCount>(url);
	const datasetSize = 5;
	const [chartData, setChartData] = useState<Array<ChartData>>([]);

	useEffect(() => {
		for (let i = 0; i < sectors.length + 1; i++) {
			if (tabIndex === 0) {
				setSector("All");//state for the queryParams to fetch all orders
				setUrl(`/api/v1/orders/order/top-products?dataset-size=${datasetSize}&sector=${sector}`);
				console.log(sector);
			} else if (tabIndex === i + 1) {
				setSector(sectors[i]?.name);//state for the queryParams to fetch orders by product's sector
				setUrl(`/api/v1/orders/order/top-products?dataset-size=${datasetSize}&sector=${sector}`);
				console.log(sector);
			}
		}
		if (topRequestedOrders.length > 0) {
			const topOrders: Array<ChartData> = topRequestedOrders.map(topOrder => ({
				value: topOrder.value ?? 0,
				name: topOrder.productName ?? 'none',
			}));
			setChartData(topOrders);
		}
		console.log(topRequestedOrders);
	}, [topRequestedOrders, tabIndex, url, sector]);


	const option = {
		tooltip: {
			trigger: 'item'
		},
		legend: {
			top: '1%',//adjust the position of the legend
			orient: 'vertical',
			left: 'left',
			textStyle: {
				color: `${colorMode === 'light' ? '#4a5568' : '#a0aec0'}`,
				fontSize: 14,
			}
		},
		series: [
			{
				name: 'Quantity',
				type: 'pie',
				radius: ['40%', '70%'],
				center: ['50%', '62%'],
				padAngle: 8,
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
				},
				label: {
					show: true,
					position: 'outside',
					color: `${colorMode === 'light' ? '#4a5568' : '#a0aec0'}`,
				},
				labelLine: {
					show: true,
					smooth: 0.2,
					length: 10,
					length2: 20
				},
				data: chartData
			}
		]
	};
	return (
		<div>
			<Tabs isFitted colorScheme='red' index={tabIndex} variant='enclosed'
				onChange={(index) => setTabIndex(index)}>
				<TabList mb='1em'>
					<Tab>{'All'}</Tab>
					{sectors.map((sector, i) => (
						<Tab key={i}>{sector.name}</Tab>
					))}
				</TabList>
				<TabPanels>
					<TabPanel>
						<ReactECharts option={option} style={{ height: 420, width: isDesktop ? '45vw' : '60vw' }} />
					</TabPanel>
					{sectors.map((_, i) => (
						<TabPanel key={i}>
							<ReactECharts option={option} style={{ height: 420, width: isDesktop ? '45vw' : '60vw' }} />
						</TabPanel>
					))}
				</TabPanels>
			</Tabs>
		</div>

	);
};

export default CommonOrders;