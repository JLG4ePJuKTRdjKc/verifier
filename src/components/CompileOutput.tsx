import { useSubmitSources } from "../lib/useSubmitSources";
import { useLoadContractInfo } from "../lib/useLoadContractInfo";
import { usePublishStepsStore } from "./usePublishStepsStore";
import { Box } from "@mui/system";
import { CompilationNotification, NotificationType } from "./CompilationNotification";
import { CenteringBox } from "./common.styled";
import puzzle from "../assets/reorder-hint.svg";
import hint from "../assets/light-bulb.svg";
import like from "../assets/like.svg";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { DataRowTitle, DataRowValue } from "./dataBlock.styled";
import React from "react";

export const NotificationTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 400,
  marginBottom: "10px",
});

const HintItem = styled("li")({
  maxWidth: 650,
  fontSize: 14,
  fontWeight: 400,
  marginBottom: 10,
});

const OutputTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 700,
});

const SuccessTitle = styled(Typography)({
  fontSize: 14,
  fontWeight: 400,
});

const ErrorRow = styled(CenteringBox)({
  padding: "20px 30px",
  paddingLeft: 0,
  "&:hover": {
    background: "transparent",
  },
});

const ErrorRowTitle = styled(DataRowTitle)({
  minWidth: 200,
  fontSize: 14,
  fontWeight: 600,
});

const ErrorRowSeparator = styled(Box)({
  borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
});

const ErrorRowValue = styled(DataRowValue)({
  color: "#000",
  fontSize: 14,
  fontWeight: 400,
});

export function CompileOutput() {
  const { data: submitSourcesData, error } = useSubmitSources();
  const { data: contractInfoData } = useLoadContractInfo();
  const { setPublishExpanded, setAddSourcesExpanded } = usePublishStepsStore();

  const compileResult = submitSourcesData?.result?.compileResult;
  const hints = submitSourcesData?.hints ?? [];
  // https://t.me/+4S9EdWndFec4MWYy
  return (
    <Box my={3}>
      {["similar"].includes(compileResult?.result ?? "") && (
        <CompilationNotification
          type={NotificationType.SUCCESS}
          title={
            <CenteringBox>
              <CenteringBox mr={1}>
                <img src={like} alt="Like icon" width={31} height={31} />
              </CenteringBox>
              <SuccessTitle>
                {" "}
                <b>Great!</b> Compile output hash matches this on-chain contract
              </SuccessTitle>
            </CenteringBox>
          }
          notificationBody={<Box />}
        />
      )}

      {["not_similar"].includes(compileResult?.result ?? "") && (
        <CompilationNotification
          type={NotificationType.ERROR}
          title={
            <CenteringBox>
              <CenteringBox mr={1}>
                <img src={puzzle} alt="Reorder icon" width={39} height={26} />
              </CenteringBox>
              <OutputTitle>Hashes are not similar</OutputTitle>
            </CenteringBox>
          }
          notificationBody={
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <ErrorRow>
                <ErrorRowTitle>Contract hash</ErrorRowTitle>
                <ErrorRowValue>{contractInfoData?.hash ?? "-"}</ErrorRowValue>
              </ErrorRow>
              <ErrorRowSeparator />
              <ErrorRow>
                <ErrorRowTitle>Compile output hash</ErrorRowTitle>
                <ErrorRowValue>{compileResult?.hash ?? "-"}</ErrorRowValue>
              </ErrorRow>
            </Box>
          }
        />
      )}

      {compileResult?.error && (
        <CompilationNotification
          type={NotificationType.NOTIFICATION}
          title={
            <NotificationTitle>
              <span style={{ color: "#FC5656" }}>Error: </span>
              Compile error
            </NotificationTitle>
          }
          notificationBody={
            <Box sx={{ overflow: "auto", maxHeight: 300 }}>
              <pre>
                <code>{compileResult.error}</code>
              </pre>
            </Box>
          }
        />
      )}

      {!!error && <h4>❌ {error.toString()}</h4>}

      {hints.length > 0 && (
        <CompilationNotification
          type={NotificationType.HINT}
          title={
            <CenteringBox mb={2}>
              <CenteringBox mr={1}>
                <img src={hint} alt="Light bulb icon" width={21} height={22} />
              </CenteringBox>
              <OutputTitle>Possible reasons for failure</OutputTitle>
            </CenteringBox>
          }
          notificationBody={
            <ul style={{ paddingLeft: 25 }}>
              {hints.map((hint) => (
                <HintItem>{hint}</HintItem>
              ))}
            </ul>
          }
        />
      )}
    </Box>
  );
}
