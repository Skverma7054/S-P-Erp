import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { axiosGet } from "../../api/apiServices";
import ComponentCardWthBtns from "../../customComponent/common/ComponentCardWthBtns";
import CustomTable from "../../customComponent/tables/CustomTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function ChainageUploadDetails() {
  const { uploadId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["chainage-upload-details", uploadId],
    queryFn: () => axiosGet(`/chainage-consumption/${uploadId}`),
    enabled: !!uploadId,
  });

  const chainageRows = data?.data?.chainage_data?.chainage || [];

  const columns = [
  { key: "s_no", label: "S.No" },
  { key: "chainage", label: "Chainage (From – To)" },
  { key: "length_m", label: "Length (m)" },

  { key: "subgrade_cum", label: "Subgrade (cum)" },
  { key: "wmm_cum", label: "WMM (cum)" },
  { key: "ctsb_cum", label: "CTSB (cum)" },
  { key: "dbm_cum", label: "DBM (cum)" },
  { key: "bc_cum", label: "BC (cum)" },

  { key: "prime_coat_m2", label: "Prime Coat (m²)" },
  { key: "tack_coat_m2", label: "Tack Coat (m²)" },

  { key: "kerb_rm", label: "Kerb (RM)" },
  { key: "rcccb_rm", label: "RCC CB (RM)" },
  { key: "w_beam_cb_rm", label: "W Beam CB (RM)" },
  { key: "thrie_beam_cb_rm", label: "Thrie Beam CB (RM)" },

  { key: "earthen_shoulder", label: "Earthen Shoulder" },
  { key: "granular_shoulder", label: "Granular Shoulder" },
  { key: "median_filling_cum", label: "Median Filling (cum)" },

  { key: "unlined_drain_rm", label: "Unlined Drain (RM)" },
  { key: "footpath_with_drain_rm", label: "Footpath + Drain (RM)" },

  { key: "tcs_type", label: "TCS Type" },
];


  const tableData =
  chainageRows.map((row: any) => ({
    s_no: row.s_no,
    chainage: `${row.chainage_from} – ${row.chainage_to}`,
    length_m: row.length_m,

    subgrade_cum: row.subgrade_cum,
    wmm_cum: row.wmm_cum,
    ctsb_cum: row.ctsb_cum,
    dbm_cum: row.dbm_cum,
    bc_cum: row.bc_cum,

    prime_coat_m2: row.prime_coat_m2,
    tack_coat_m2: row.tack_coat_m2,

    kerb_rm: row.kerb_rm,
    rcccb_rm: row.rcccb_rm,
    w_beam_cb_rm: row.w_beam_cb_rm,
    thrie_beam_cb_rm: row.thrie_beam_cb_rm,

    earthen_shoulder: row.earthen_shoulder,
    granular_shoulder: row.granular_shoulder,
    median_filling_cum: row.median_filling_cum,

    unlined_drain_rm: row.unlined_drain_rm,
    footpath_with_drain_rm: row.footpath_with_drain_rm,

    tcs_type: row.tcs_type,
  })) || [];


  return (<>
    <PageBreadcrumb
        pageTitle={`Chainage Details (Upload #${uploadId})`}
        
      />
    <ComponentCardWthBtns
      title={`Chainage Details (Upload #${uploadId})`}
      actions={[
        {
          type: "button",
          key: "back",
          label: "Back",
          variant: "outline",
          onClick: () => navigate(-1),
        },
      ]}
    >
      <CustomTable
        columns={columns}
        data={tableData}
        loading={isLoading}
      />
    </ComponentCardWthBtns>
    </>
  );
}
