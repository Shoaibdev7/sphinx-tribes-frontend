import { EuiGlobalToastList, EuiIcon, EuiLink, EuiLoadingSpinner } from '@elastic/eui';
import {
  Body,
  WorkspaceBody,
  Leftheader,
  Header,
  HeaderWrap,
  DataWrap,
  DataWrap2,
  LeftSection,
  RightSection,
  FieldWrap,
  Label,
  Data,
  OptionsWrap,
  TextArea,
  StyledListElement,
  FeatureLink,
  StyledList
} from 'pages/tickets/style';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useStores } from 'store';
import { useDeleteConfirmationModal } from 'components/common';
import { Box } from '@mui/system';
import { Feature, Person, Workspace } from 'store/interface';
import MaterialIcon from '@material/react-material-icon';
import { Button, Modal } from 'components/common';
import {
  ImageContainer,
  CompanyNameAndLink,
  CompanyLabel,
  UrlButtonContainer,
  UrlButton,
  RightHeader,
  CompanyDescription
} from 'pages/tickets/workspace/workspaceHeader/WorkspaceHeaderStyles';
import githubIcon from 'pages/tickets/workspace/workspaceHeader/Icons/githubIcon.svg';
import websiteIcon from 'pages/tickets/workspace/workspaceHeader/Icons/websiteIcon.svg';
import { EuiToolTip } from '@elastic/eui';
import { useIsMobile } from 'hooks';
import styled from 'styled-components';
import { AvatarGroup } from 'components/common/AvatarGroup';
import avatarIcon from '../../public/static/profile_avatar.svg';
import threeDotsIcon from '../widgetViews/Icons/threeDotsIcon.svg';
import { colors } from '../../config/colors';
import dragIcon from '../../pages/superadmin/header/icons/drag_indicator.svg';
import AddFeature from './workspace/AddFeatureModal';
import {
  ActionButton,
  RowFlex,
  ButtonWrap,
  RepoName,
  RepoEliipsis,
  WorkspaceOption,
  ImgText,
  MissionRowFlex
} from './workspace/style';
import AddRepoModal from './workspace/AddRepoModal';
import EditSchematic from './workspace/EditSchematicModal';
import ManageWorkspaceUsersModal from './workspace/ManageWorkspaceUsersModal';
import { BudgetWrapComponent } from './BudgetWrap';
import { LoadMoreContainer } from './WidgetSwitchViewer';
const color = colors['light'];

const FeaturesWrap = styled.div`
  margin-top: 25px;
`;

const FeatureDataWrap = styled.div`
  padding: 8px 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  min-width: 100%;
  flex-direction: column;
  position: relative;
  background: #ffffff;
`;

const FeatureCount = styled.h4`
  font-size: 1.1rem;
  font-weight: 400;
  padding: 0px;
  color: #5f6368;
  margin: 0;
`;

const FeatureData = styled.div`
  min-width: calc(100% - 7%);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  margin-left: 7%;
  color: #5f6368;
`;

export const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 9rem;
  border-radius: 10px;
  overflow: hidden;
  background-color: #ebedf1;
`;

export const SelectedImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RowWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem; /* Adjust this margin as needed */
`;

const EuiLinkStyled = styled(EuiLink) <{ isMobile: boolean }>`
  border: none;
  text-decoration: underline;
  margin-left: ${(props: any) => (props.isMobile ? 'auto' : '0')};
  margin: ${(props: any) => (props.isMobile ? '0' : '0')};
`;

const StatusWrap = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

interface StatusType {
  type: string;
}

const StatusBox = styled.div<StatusType>`
  min-width: 155px;
  min-height: 65px;
  padding: 10px 5px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  position: relative;
  background: ${(props: any) => {
    if (props.type === 'completed') {
      return '#9157F612';
    } else if (props.type === 'assigned') {
      return '#49C99812';
    } else if (props.type === 'open') {
      return '#618AFF12';
    }
  }};
  font-weight: 600;
  border: ${(props: any) => {
    if (props.type === 'completed') {
      return ' 0.5px solid #9157F6';
    } else if (props.type === 'assigned') {
      return '0.5px solid #2FB379';
    } else if (props.type === 'open') {
      return '0.5px solid #5078F2';
    }
  }};
  color: ${(props: any) => {
    if (props.type === 'completed') {
      return '#9157F6';
    } else if (props.type === 'assigned') {
      return '#2FB379';
    } else if (props.type === 'open') {
      return '#5078F2';
    }
  }};
`;

interface BudgetHeaderProps {
  color: string;
}

const BudgetCount = styled.span<BudgetHeaderProps>`
  background: ${(p: any) => p.color};
  color: #fff;
  padding: 0.5px 5px;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: bolder;
  display: inline-block;
  margin-left: 10px;
`;

const BudgetBountyLink = styled.span`
  cursor: pointer;
  position: absolute;
  right: 8px;
  top: 4px;
`;

const DragIcon = styled.img`
  width: 20px;
  height: 20px;
  padding: 0px;
  margin: 0;
`;

const WorkspaceMission = () => {
  const { main, ui } = useStores();
  const { uuid } = useParams<{ uuid: string }>();
  const [workspaceData, setWorkspaceData] = useState<Workspace>();
  const [loading, setLoading] = useState(true);
  const [displayMission, setDidplayMission] = useState(false);
  const [editMission, setEditMission] = useState(false);
  const [displaySchematic, setDidplaySchematic] = useState(false);
  const [editTactics, setEditTactics] = useState(false);
  const [displayTactics, setDidplayTactics] = useState(false);
  const [mission, setMission] = useState(workspaceData?.mission);
  const [schematicModal, setSchematicModal] = useState(false);
  const [tactics, setTactics] = useState(workspaceData?.tactics);
  const [repoName, setRepoName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentuuid, setCurrentuuid] = useState('');
  const [modalType, setModalType] = useState('add');
  const [featureModal, setFeatureModal] = useState(false);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [featuresCount, setFeaturesCount] = useState(0);
  const [isOpenUserManage, setIsOpenUserManage] = useState<boolean>(false);
  const [users, setUsers] = useState<Person[]>([]);

  const isMobile = useIsMobile();

  const fetchRepositories = useCallback(async () => {
    try {
      const data = await main.getRepositories(uuid);
      setRepositories(data);
    } catch (error) {
      console.error(error);
    }
  }, [main, uuid]);

  const openModal = (type: string, repository?: any) => {
    if (type === 'add') {
      setRepoName('');
      setCurrentuuid('');
      setRepoUrl('');
      setIsModalVisible(true);
      setModalType(type);
    } else if (type === 'edit') {
      setRepoName(repository.name);
      setCurrentuuid(repository.uuid);
      setRepoUrl(repository.url);
      setIsModalVisible(true);
      setModalType(type);
    }
  };

  const closeRepoModal = () => {
    setIsModalVisible(false);
  };

  const DeleteRepository = async (workspace_uuid: string, repository_uuid: string) => {
    try {
      await main.deleteRepository(workspace_uuid, repository_uuid);
      closeRepoModal();
      fetchRepositories();
    } catch (error) {
      console.error('Error deleteRepository', error);
    }
  };

  const handleDelete = () => {
    closeRepoModal();
    DeleteRepository(uuid, currentuuid);
  };

  const { openDeleteConfirmation } = useDeleteConfirmationModal();

  const deleteHandler = () => {
    openDeleteConfirmation({
      onDelete: handleDelete,
      children: (
        <Box fontSize={20} textAlign="center">
          Are you sure you want to <br />
          <Box component="span" fontWeight="500">
            Delete this Repo?
          </Box>
        </Box>
      )
    });
  };

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  const getWorkspaceData = useCallback(async () => {
    if (!uuid) return;
    const workspaceData = await main.getUserWorkspaceByUuid(uuid);
    if (!workspaceData) return;
    setWorkspaceData(workspaceData);

    setLoading(false);
  }, [uuid, main]);

  const getWorkspaceUsers = useCallback(async () => {
    if (uuid) {
      const users = await main.getWorkspaceUsers(uuid);
      setUsers(users);
      return users;
    }
  }, [main, uuid]);

  useEffect(() => {
    getWorkspaceData();
    getWorkspaceUsers();
  }, [getWorkspaceData, getWorkspaceUsers]);

  const getFeaturesCount = useCallback(async () => {
    if (!uuid) return;
    const featuresCount = await main.getWorkspaceFeaturesCount(uuid);
    if (!featuresCount) return;
    setFeaturesCount(featuresCount);

    setLoading(false);
  }, [uuid, main]);

  useEffect(() => {
    getFeaturesCount();
  }, [getFeaturesCount]);

  const getFeatures = useCallback(async () => {
    if (!uuid) return;
    const featuresRes = await main.getWorkspaceFeatures(uuid, { page: currentPage });
    if (!featuresRes) return;
    setFeatures((feats: Feature[]) => [...feats, ...featuresRes]);
    getFeaturesCount();

    setLoading(false);
  }, [uuid, main, getFeaturesCount, currentPage]);

  useEffect(() => {
    getFeatures();
  }, [getFeatures]);

  const handleWebsiteButton = (websiteUrl: string) => {
    window.open(websiteUrl, '_blank');
  };

  const handleGithubButton = (githubUrl: string) => {
    window.open(githubUrl, '_blank');
  };

  const editTacticsActions = () => {
    setEditTactics(!editTactics);
    setDidplayTactics(false);
  };

  const editMissionActions = () => {
    setEditMission(!editMission);
    setDidplayMission(false);
  };

  const missionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length) {
      setMission(newValue);
    }
  };

  const tacticsChange = (e: any) => {
    setTactics(e.target.value);
  };

  const submitMission = async () => {
    const body = {
      mission: mission ?? '',
      owner_pubkey: ui.meInfo?.owner_pubkey ?? '',
      uuid: workspaceData?.uuid ?? ''
    };
    await main.workspaceUpdateMission(body);
    await getWorkspaceData();
    setEditMission(false);
  };

  const submitTactics = async () => {
    const body = {
      tactics: tactics ?? '',
      owner_pubkey: ui.meInfo?.owner_pubkey ?? '',
      uuid: workspaceData?.uuid ?? ''
    };
    await main.workspaceUpdateTactics(body);
    await getWorkspaceData();
    setEditTactics(false);
  };

  const toggleFeatureModal = () => {
    setFeatureModal(!featureModal);
  };

  const toggleSchematicModal = () => {
    setDidplaySchematic(false);
    setSchematicModal(!schematicModal);
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  // const handleFeaturePriority = async (curFeature: Feature, otherFeature: Feature) => {
  //   const curFeatureBody = {
  //     workspace_uuid: curFeature.workspace_uuid || '',
  //     uuid: curFeature.uuid,
  //     priority: otherFeature.priority
  //   };

  //   await main.addWorkspaceFeature(curFeatureBody);

  //   const otherFeatureBody = {
  //     workspace_uuid: otherFeature.workspace_uuid || '',
  //     uuid: otherFeature.uuid,
  //     priority: curFeature.priority
  //   };

  //   await main.addWorkspaceFeature(otherFeatureBody);

  //   window.location.reload();
  // };

  const toastsEl = (
    <EuiGlobalToastList
      toasts={ui.toasts}
      dismissToast={() => ui.setToasts([])}
      toastLifeTimeMs={3000}
    />
  );
  const avatarList = useMemo(
    () => users.map((user: Person) => ({ name: user.owner_alias, imageUrl: user.img })),
    [users]
  );

  if (loading) {
    return (
      <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
        <EuiLoadingSpinner size="xl" />
      </Body>
    );
  }

  const toggleManageUserModal = () => setIsOpenUserManage(!isOpenUserManage);
  const updateWorkspaceUsers = (updatedUsers: Person[]) => setUsers(updatedUsers);

  return (
    !loading && (
      <WorkspaceBody>
        <HeaderWrap>
          <Header>
            <Leftheader>
              <ImageContainer
                src={workspaceData?.img || avatarIcon}
                width="72px"
                height="72px"
                alt="workspace icon"
              />
              <CompanyNameAndLink>
                <CompanyLabel>{workspaceData?.name}</CompanyLabel>
                <UrlButtonContainer data-testid="url-button-container">
                  {workspaceData?.website !== '' ? (
                    <UrlButton onClick={() => handleWebsiteButton(workspaceData?.website ?? '')}>
                      <img src={websiteIcon} alt="" />
                      Website
                    </UrlButton>
                  ) : (
                    ''
                  )}
                  {workspaceData?.github !== '' ? (
                    <UrlButton onClick={() => handleGithubButton(workspaceData?.github ?? '')}>
                      <img src={githubIcon} alt="" />
                      Github
                    </UrlButton>
                  ) : (
                    ''
                  )}
                </UrlButtonContainer>
              </CompanyNameAndLink>
            </Leftheader>
            <RightHeader>
              <CompanyDescription>{workspaceData?.description}</CompanyDescription>
            </RightHeader>
          </Header>
        </HeaderWrap>
        <DataWrap style={{ paddingBottom: '0px' }}>
          <LeftSection>
            <FieldWrap>
              <Label>Mission</Label>
              <Data>
                <OptionsWrap>
                  <MaterialIcon
                    icon={'more_horiz'}
                    className="MaterialIcon"
                    onClick={() => setDidplayMission(!displayMission)}
                    data-testid="mission-option-btn"
                  />
                  {displayMission && (
                    <WorkspaceOption>
                      <ul>
                        <li data-testid="mission-edit-btn" onClick={editMissionActions}>
                          Edit
                        </li>
                      </ul>
                    </WorkspaceOption>
                  )}
                </OptionsWrap>
                {!editMission && (
                  <>{workspaceData?.mission ? workspaceData.mission : 'No mission yet'}</>
                )}

                {editMission && (
                  <>
                    <TextArea
                      placeholder="Enter mission"
                      onChange={missionChange}
                      value={mission ?? workspaceData?.mission}
                      data-testid="mission-textarea"
                    />
                    <ButtonWrap>
                      <ActionButton
                        onClick={() => setEditMission(!editMission)}
                        data-testid="mission-cancel-btn"
                        color="cancel"
                      >
                        Cancel
                      </ActionButton>
                      <ActionButton
                        color="primary"
                        onClick={submitMission}
                        data-testid="mission-update-btn"
                      >
                        Update
                      </ActionButton>
                    </ButtonWrap>
                  </>
                )}
              </Data>
            </FieldWrap>
            <FieldWrap>
              <Label>Tactics and Objectives</Label>
              <Data>
                <OptionsWrap>
                  <MaterialIcon
                    onClick={() => setDidplayTactics(!displayTactics)}
                    icon={'more_horiz'}
                    className="MaterialIcon"
                    data-testid="tactics-option-btn"
                  />
                  {displayTactics && (
                    <WorkspaceOption>
                      <ul>
                        <li data-testid="tactics-edit-btn" onClick={editTacticsActions}>
                          Edit
                        </li>
                      </ul>
                    </WorkspaceOption>
                  )}
                </OptionsWrap>
                {!editTactics && (
                  <>{workspaceData?.tactics ? workspaceData.tactics : 'No tactics yet'}</>
                )}

                {editTactics && (
                  <>
                    <TextArea
                      placeholder="Enter tactics"
                      onChange={tacticsChange}
                      value={tactics ?? workspaceData?.tactics}
                      data-testid="tactics-textarea"
                    />
                    <ButtonWrap>
                      <ActionButton
                        data-testid="tactics-cancel-btn"
                        onClick={() => setEditTactics(!editTactics)}
                        color="cancel"
                      >
                        Cancel
                      </ActionButton>
                      <ActionButton
                        data-testid="tactics-update-btn"
                        color="primary"
                        onClick={submitTactics}
                      >
                        Update
                      </ActionButton>
                    </ButtonWrap>
                  </>
                )}
              </Data>
            </FieldWrap>
            <FieldWrap>
              <DataWrap2>
                <RowFlex>
                  <Label>Repositories</Label>
                  <Button
                    onClick={() => openModal('add')}
                    style={{
                      borderRadius: '5px',
                      margin: 0,
                      marginLeft: 'auto'
                    }}
                    dataTestId="new-repository-btn"
                    text="Add Repository"
                  />
                </RowFlex>
                <StyledList>
                  {repositories.map((repository: any) => (
                    <StyledListElement key={repository.id}>
                      <RepoEliipsis
                        src={threeDotsIcon}
                        alt="Three dots icon"
                        onClick={() => openModal('edit', repository)}
                      />
                      <RepoName>{repository.name} : </RepoName>
                      <EuiToolTip position="top" content={repository.url}>
                        <a href={repository.url} target="_blank" rel="noreferrer">
                          {repository.url}
                        </a>
                      </EuiToolTip>
                    </StyledListElement>
                  ))}
                </StyledList>
              </DataWrap2>
            </FieldWrap>
          </LeftSection>
          <RightSection>
            <FieldWrap>
              <Label>Schematic</Label>
              <Data style={{ border: 'none', paddingLeft: '0px', padding: '5px 5px' }}>
                <ImgContainer>
                  {workspaceData?.schematic_img ? (
                    <SelectedImg src={workspaceData?.schematic_img} alt="schematic image" />
                  ) : (
                    <ImgText>Image</ImgText>
                  )}
                </ImgContainer>
                <RowWrap>
                  <OptionsWrap style={{ position: 'unset', display: 'contents' }}>
                    <MaterialIcon
                      icon={'more_horiz'}
                      className="MaterialIcon"
                      onClick={() => setDidplaySchematic(!displaySchematic)}
                      data-testid="schematic-option-btn"
                      style={{ transform: 'rotate(90deg)' }}
                    />
                    <button
                      style={{ display: displaySchematic ? 'block' : 'none' }}
                      onClick={toggleSchematicModal}
                      data-testid="schematic-edit-btn"
                    >
                      Edit
                    </button>
                  </OptionsWrap>
                  {workspaceData?.schematic_url ? (
                    <a
                      href={workspaceData?.schematic_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="schematic-url"
                      style={{ marginLeft: '0.5rem' }}
                    >
                      schematic
                    </a>
                  ) : (
                    <span style={{ marginLeft: '0.5rem' }}>No schematic url yet</span>
                  )}
                </RowWrap>
              </Data>
            </FieldWrap>
            <FieldWrap>
              <RowFlex style={{ gap: '25px', marginBottom: '15px' }}>
                <Label style={{ margin: 0 }}>People</Label>
                <EuiLinkStyled isMobile={isMobile} color="primary" onClick={toggleManageUserModal}>
                  Manage
                </EuiLinkStyled>
              </RowFlex>
              <AvatarGroup avatarList={avatarList} avatarSize="xl" maxGroupSize={5} />
            </FieldWrap>
          </RightSection>
        </DataWrap>

        <DataWrap>
          <FieldWrap style={{ background: 'white' }}>
            <BudgetWrapComponent uuid={uuid} org={workspaceData} />
          </FieldWrap>
        </DataWrap>
        <DataWrap>
          <FieldWrap style={{ marginBottom: '5rem' }}>
            <RowFlex>
              <Label>Features</Label>
              <Button
                onClick={toggleFeatureModal}
                style={{
                  borderRadius: '5px',
                  margin: 0,
                  marginLeft: 'auto'
                }}
                dataTestId="new-feature-btn"
                text="New Feature"
              />
            </RowFlex>
            <FeaturesWrap>
              {features &&
                features
                  .sort((a: Feature, b: Feature) => a.priority - b.priority)
                  .map((feat: Feature, i: number) => (
                    <FeatureDataWrap key={i} data-testid="feature-item">
                      <MissionRowFlex>
                        <DragIcon src={dragIcon} />
                        <FeatureCount>{i + 1}</FeatureCount>
                      </MissionRowFlex>
                      <FeatureData>
                        <FeatureLink
                          href={`/feature/${feat.uuid}`}
                          target="_blank"
                          style={{ marginLeft: '1rem' }}
                        >
                          {feat.name}
                        </FeatureLink>
                        <StatusWrap>
                          <StatusBox type="completed">
                            Completed
                            <BudgetCount color="#9157F6">
                              {feat.bounties_count_completed
                                ? feat.bounties_count_completed.toLocaleString()
                                : 0}
                            </BudgetCount>
                            <BudgetBountyLink>
                              <Link target="_blank" to={''}>
                                <EuiIcon type="popout" color="#9157F6" />
                              </Link>
                            </BudgetBountyLink>
                          </StatusBox>
                          <StatusBox type="assigned">
                            Assigned
                            <BudgetCount color="#2FB379">
                              {feat.bounties_count_assigned
                                ? feat.bounties_count_assigned.toLocaleString()
                                : 0}
                            </BudgetCount>
                            <BudgetBountyLink>
                              <Link target="_blank" to={''}>
                                <EuiIcon type="popout" color="#2FB379" />
                              </Link>
                            </BudgetBountyLink>
                          </StatusBox>
                          <StatusBox type="open">
                            Open
                            <BudgetCount color="#5078F2">
                              {feat.bounties_count_open
                                ? feat.bounties_count_open.toLocaleString()
                                : 0}
                            </BudgetCount>
                            <BudgetBountyLink>
                              <Link target="_blank" to={''}>
                                <EuiIcon size="m" type="popout" color="#5078F2" />
                              </Link>
                            </BudgetBountyLink>
                          </StatusBox>
                        </StatusWrap>
                      </FeatureData>
                    </FeatureDataWrap>
                  ))}
            </FeaturesWrap>
            {featuresCount > features.length ? (
              <LoadMoreContainer
                color={color}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div className="LoadMoreButton" onClick={() => loadMore()}>
                  Load More
                </div>
              </LoadMoreContainer>
            ) : null}
          </FieldWrap>
        </DataWrap>
        <Modal
          visible={featureModal}
          style={{
            height: '100%',
            flexDirection: 'column'
          }}
          envStyle={{
            marginTop: isMobile ? 64 : 0,
            background: color.pureWhite,
            zIndex: 20,
            maxHeight: '100%',
            borderRadius: '10px',
            minWidth: isMobile ? '100%' : '25%',
            minHeight: isMobile ? '100%' : '20%'
          }}
          overlayClick={toggleFeatureModal}
          bigCloseImage={toggleFeatureModal}
          bigCloseImageStyle={{
            top: '-18px',
            right: '-18px',
            background: '#000',
            borderRadius: '50%'
          }}
        >
          <AddFeature
            closeHandler={toggleFeatureModal}
            getFeatures={getFeatures}
            workspace_uuid={uuid}
            priority={featuresCount}
          />
        </Modal>
        <Modal
          visible={isModalVisible}
          style={{
            height: '100%',
            flexDirection: 'column'
          }}
          envStyle={{
            marginTop: isMobile ? 64 : 0,
            background: color.pureWhite,
            zIndex: 20,
            maxHeight: '100%',
            borderRadius: '10px',
            minWidth: isMobile ? '100%' : '25%',
            minHeight: isMobile ? '100%' : '20%'
          }}
          overlayClick={closeRepoModal}
          bigCloseImage={closeRepoModal}
          bigCloseImageStyle={{
            top: '-18px',
            right: '-18px',
            background: '#000',
            borderRadius: '50%'
          }}
        >
          <AddRepoModal
            closeHandler={closeRepoModal}
            getRepositories={fetchRepositories}
            workspace_uuid={uuid}
            currentUuid={currentuuid}
            modalType={modalType}
            handleDelete={deleteHandler}
            name={repoName}
            url={repoUrl}
          />
        </Modal>
        <Modal
          visible={schematicModal}
          style={{
            height: '100%',
            flexDirection: 'column'
          }}
          envStyle={{
            marginTop: isMobile ? 64 : 0,
            background: color.pureWhite,
            zIndex: 20,
            maxHeight: '100%',
            borderRadius: '10px',
            minWidth: isMobile ? '100%' : '25%',
            minHeight: isMobile ? '100%' : '20%'
          }}
          overlayClick={toggleSchematicModal}
          bigCloseImage={toggleSchematicModal}
          bigCloseImageStyle={{
            top: '-18px',
            right: '-18px',
            background: '#000',
            borderRadius: '50%'
          }}
        >
          <EditSchematic
            closeHandler={toggleSchematicModal}
            getSchematic={getWorkspaceData}
            uuid={workspaceData?.uuid}
            owner_pubkey={ui.meInfo?.owner_pubkey}
            schematic_url={workspaceData?.schematic_url ?? ''}
            schematic_img={workspaceData?.schematic_img ?? ''}
          />
        </Modal>
        {isOpenUserManage && (
          <ManageWorkspaceUsersModal
            isOpen={isOpenUserManage}
            close={() => setIsOpenUserManage(!isOpenUserManage)}
            uuid={uuid}
            org={workspaceData}
            users={users}
            updateUsers={updateWorkspaceUsers}
          />
        )}
        {toastsEl}
      </WorkspaceBody>
    )
  );
};

export default WorkspaceMission;
