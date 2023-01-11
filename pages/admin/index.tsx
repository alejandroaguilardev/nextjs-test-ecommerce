import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';
import { Grid, Typography } from '@mui/material';
import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { AdminLayout } from "../../components/layouts";
import { SummaryTitle } from '../../components/Admin';
import { DashboardSummaryResponse } from '../../interfaces';

const DashboardPage: NextPage = () => {
	const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
		refreshInterval: 30 * 1000
	});

	const [refreshIn, setRefreshIn] = useState(30);

	useEffect(() => {
		const interval = setInterval(() => {
			console.log('Ticks')
			setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])


	if (!error && !data) {
		return <></>
	}

	if (error) {
		console.log(error)
		return <Typography>Error al cargar la infomación</Typography>
	}

	const {
		numberOfOrders,
		paidOrders,
		noPaidOrders,
		numberOfClients,
		numberOfProducts,
		productWithNoInventory,
		lowInventary,
	} = data!;

	return (
		<AdminLayout
			title="Dashboard"
			subTitle="Estadisticas generales"
			icon={<DashboardOutlined />}
		>
			<Grid container spacing={2}>
				<SummaryTitle
					title={numberOfOrders}
					subTitle="Ordenes totales"
					icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTitle
					title={paidOrders}
					subTitle="Ordenes Pagadas"
					icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
				/>
				<SummaryTitle
					title={noPaidOrders}
					subTitle="Ordenes Pendientes"
					icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTitle
					title={numberOfClients}
					subTitle="Clientes"
					icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
				/>
				<SummaryTitle
					title={numberOfProducts}
					subTitle="Productos"
					icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTitle
					title={productWithNoInventory}
					subTitle="Sin Existencias"
					icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTitle
					title={lowInventary}
					subTitle="Bajo Inventario"
					icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
				/>

				<SummaryTitle
					title={refreshIn}
					subTitle="Actualización en:"
					icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
				/>
			</Grid>
		</AdminLayout>
	);
};

export default DashboardPage;
