import React, { useEffect, useRef, useState } from 'react';
// 아이콘 라이브러리
import { User, List, BookUser, SquarePlus, Search } from 'lucide-react';
// 네트워크 그래프 시각화 (노드, 엣지)
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
// 지구 아이콘 불러오기
import earthIMG from '../assets/earth.png';
// 꽃 아이콘 불러오기
import flowerIMG from '../assets/flower.png';
// UserCard 불러오기
import UserCard from '../Component/UserCard';
// AddPopup 불러오기
import AddPopup from '../Component/AddPopup';
// SearchPopup 불러오기
import SearchPopup from '../Component/SearchPopup';
// MainScreen 디자인 불러오기
import './MainScreen.css';
// 페이지 이동
import { useNavigate } from 'react-router-dom';

export default function MainScreen() {
  const networkRef = useRef(null);
  const networkInstance = useRef(null);
  // 노드 클릭 시, UserCard의 표시 여부
  const [cardVisible, setCardVisible] = useState(false);
  // 클릭한 노드의 좌표를 이용해 UserCard 위치 설정
  const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
  // 클릭한 노드의 데이터 저장
  const [clickedNodeData, setClickedNodeData] = useState(null);
  // AddPopup 표시 여부
  const [popupVisible, setPopupVisible] = useState(false);
  // SearchPopup 표시 여부
  const [searchVisible, setSearchVisible] = useState(false);
  // 검색창에 입력한 값
  const [searchQuery, setSearchQuery] = useState('');
  // 사용자 생성 카테고리 목록 (임시 카테고리 A, A-1, A-2)
  const [categories, setCategories] = useState([
    {
      id: 'temp_a',
      name: '카테고리 A',
      color: '#507060',
      parentCategory: null,
      x: 250,
      y: 0
    },
    {
      id: 'temp_a1',
      name: '카테고리 A-1',
      color: '#85A394',
      parentCategory: '카테고리 A',
      x: 400,
      y: -150
    },
    {
      id: 'temp_a2',
      name: '카테고리 A-2',
      color: '#ACC0B6',
      parentCategory: '카테고리 A',
      x: 400,
      y: 150
    }
  ]);
  // 사용자 생성 노드 목록 (임시 노드 김철수)
  const [nodes, setNodes] = useState([
    {
      id: 'temp_node1',
      name: '김철수',
      category: '카테고리 A-1',
      intro: '안녕하세요',
      note: '소프트웨어공학 5조입니다.',
      favorites: true,
      x: 550,
      y: -150
    }
  ]);
  // 지구 아이콘 클릭 시, 사용자 이름 나타남
  const [userName, setUserName] = useState("Soobin's Network");
  // 노드의 현재 위치 저장
  const [nodePositions, setNodePositions] = useState({});
  // 페이지 이동
  const navigate = useNavigate();
  // 방금 추가된 카테고리의 정보 잠깐 저장해 성공 화면으로 전환
  const [pendingCategory, setPendingCategory] = useState(null);
  //우상단 아이콘 Path 지정
  const iconButtons = [
    { Icon: User, path: "/userSetting" },
    { Icon: List, path: "/categoryList" },
    { Icon: BookUser, path: "/peopleList" },
  ];

  // 노드 위치 업데이트
  const updateNodePositions = () => {
    if (networkInstance.current) {
      const positions = networkInstance.current.getPositions();
      setNodePositions(positions);
    }
  };

  // 겹치지 않는 위치 찾음
  const findNonOverlappingPosition = (existingItems, itemType = 'node', targetCategory = null) => {
    const minDistance = 200; // 최소 간격
    const maxAttempts = 50; // 최대 시도 횟수
    // earthIMG 중심 좌표
    const centerX = nodePositions['me']?.x || 0;
    const centerY = nodePositions['me']?.y || 0;
    // 노드인 경우, 자신이 속한 카테고리 방향으로 위치 설정
    if (itemType === 'node' && targetCategory) {
      const category = categories.find(cat => cat.name === targetCategory);
      if (category) {
        // 카테고리 현재 위치
        const categoryX = nodePositions[category.id]?.x || category.x || 0;
        const categoryY = nodePositions[category.id]?.y || category.y || 0;
        // 중심점에서 카테고리로의 방향 벡터
        const directionX = categoryX - centerX;
        const directionY = categoryY - centerY;
        const directionLength = Math.sqrt(directionX * directionX + directionY * directionY);
        if (directionLength > 0) {
          // 방향 벡터 정규화
          const normalizedX = directionX / directionLength;
          const normalizedY = directionY / directionLength;
          // 카테고리에서 떨어진 위치에 노드 배치
          const baseDistance = directionLength + 100; // 카테고리에서 100px 멀리
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // 거리 점진적 증가 (50px씩)
            const currentDistance = baseDistance + (Math.floor(attempt / 4) * 50);
            // 각도 변경하며 부채꼴 모양으로 노드의 위치 설정
            const angleVariation = (attempt % 4 - 1.5) * 0.3; // -0.45 ~ +0.45 라디안
            const currentAngle = Math.atan2(normalizedY, normalizedX) + angleVariation;
            const x = centerX + Math.cos(currentAngle) * currentDistance;
            const y = centerY + Math.sin(currentAngle) * currentDistance;
            // 기존 아이템들과의 거리
            let isValidPosition = true;
            for (const item of existingItems) {
              const itemX = nodePositions[item.id]?.x || item.x || 0;
              const itemY = nodePositions[item.id]?.y || item.y || 0;
              const distance = Math.sqrt(
                Math.pow(x - itemX, 2) + Math.pow(y - itemY, 2)
              );
              if (distance < minDistance) {
                isValidPosition = false;
                break;
              }
            }
            if (isValidPosition) {
              return { x, y };
            }
          }
        }
      }
    }
    
    // 카테고리거나 노드의 카테고리 찾지 못한 경우, 기존 로직
    const baseRadius = itemType === 'category' ? 200 : 350; // 노드는 350px에서 시작
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // 각도 변경하며 원 모양으로 카테고리의 위치 설정
      const radiusStep = Math.floor(attempt / 8); // 8개씩 한 원에 배치
      const angleStep = (attempt % 8) * (Math.PI / 4); // 45도씩 8방향
      const currentRadius = baseRadius + (radiusStep * 100); // 100px씩 반지름 증가
      const x = centerX + Math.cos(angleStep) * currentRadius;
      const y = centerY + Math.sin(angleStep) * currentRadius;
      // 기존 아이템들과의 거리 확인
      let isValidPosition = true;
      for (const item of existingItems) {
        const itemX = nodePositions[item.id]?.x || item.x || 0;
        const itemY = nodePositions[item.id]?.y || item.y || 0;
        const distance = Math.sqrt(
          Math.pow(x - itemX, 2) + Math.pow(y - itemY, 2)
        );
        if (distance < minDistance) {
          isValidPosition = false;
          break;
        }
      }
      // 중심 노드와의 최소 거리
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - centerX, 3) + Math.pow(y - centerY, 2)
      );
      if (distanceFromCenter < baseRadius - 50) { // 기본 반지름보다 50px 가까우면 제외
        isValidPosition = false;
      }
      if (isValidPosition) {
        return { x, y };
      }
    }

    // 적절한 위치를 찾지 못한 경우 기본 위치 반환 (원형 배치)
    const fallbackAngle = Math.random() * Math.PI * 2;
    const fallbackRadius = itemType === 'category' ? 250 : 400;
    return { 
      x: centerX + Math.cos(fallbackAngle) * fallbackRadius, 
      y: centerY + Math.sin(fallbackAngle) * fallbackRadius 
    };
  };

  // 노드 데이터 업데이트
  const handleNodeUpdate = (updatedNodeData) => {
    updateNodePositions(); // 노드 위치 저장
    setNodes(prev => prev.map(node => node.id === updatedNodeData.id ? updatedNodeData : node));
    setClickedNodeData(updatedNodeData); // 현재 선택된 노드 데이터 업데이트
  };

  // 카테고리 추가
  const handleCategoryCreated = (categoryData) => {
    updateNodePositions(); // 카테고리 추가 전 현재 위치 저장
    // 기존 아이템의 위치 정보
    const existingItems = [...categories, ...nodes];
    const position = findNonOverlappingPosition(existingItems, 'category');
    const newCategory = {
      id: `c${Date.now()}`, // 카테고리 ID
      name: categoryData.name, // 카테고리 이름
      color: categoryData.color, // 카테고리 색상
      parentCategory: categoryData.parentCategory, // 상위 카테고리
      x: position.x, // 겹치지 않는 X 위치
      y: position.y  // 겹치지 않는 Y 위치
    };
    // 새로 만든 카테고리 정보 활용 위해 대기 상태로 저장
    setPendingCategory({ data: newCategory, color: categoryData.color });
    setCategories(prev => [...prev, newCategory]); // 카테고리 목록에 추가
    // 성공 화면으로 페이지 이동
    navigate('/category-complete', {
      state: { color: categoryData.color }
    });
  };

  // 노드 추가 (수정된 버전)
  const handleNodeCreated = (nodeData) => {
    updateNodePositions(); // 노드 추가 전 현재 위치 저장
    // 기존 아이템의 위치 정보
    const existingItems = [...categories, ...nodes];
    const position = findNonOverlappingPosition(existingItems, 'node', nodeData.category);
    const newNode = {
      id: `n${Date.now()}`, // 노드 ID
      name: nodeData.name, // 노드 이름
      category: nodeData.category, // 노드 카테고리
      intro: nodeData.intro, // 노드 소개
      note: nodeData.note, // 노드 설명
      favorites: nodeData.favorites, // 노드 즐겨찾기
      x: position.x, // 겹치지 않는 X 위치
      y: position.y  // 겹치지 않는 Y 위치
    };
    setNodes(prev => [...prev, newNode]); // 노드 목록에 추가
    // 즐겨찾기 할 때의 성공 화면
    if (nodeData.favorites === true) {
      navigate('/node-complete-favorite', {
        state: {star: nodeData.star}
      });
    } else { // 즐겨찾기 안 할 때의 성공 화면
      navigate('/node-complete', {
        state: {star: nodeData.star}
      });
    }
  };

  useEffect(() => { // FontAwesome 아이콘
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => { // 새로운 카테고리를 categories에 추가한 후, 성공 화면으로 이동
    if (pendingCategory) {
      const exists = categories.find(cat => cat.id === pendingCategory.data.id);
      if (exists) {
        navigate('/category-complete', {
          state: { color: pendingCategory.color }
        });
        setPendingCategory(null);
      }
    }

    // 카테고리, 노드 설정
    const nodesData = [
      { 
        id: 'me', shape: 'image', image: earthIMG, size: 150, 
        // 초기 위치 (0, 0)
        x: nodePositions['me']?.x || 0, 
        y: nodePositions['me']?.y || 0, 
        fixed: true,
        title: userName // tooltip으로 사용자 이름 표시
      },
      // C1, C2 임시 카테고리 (제외 상태)
      ...categories.filter(category => category.id !== 'c1' && category.id !== 'c2').map(category => ({
        id: category.id, 
        label: category.name,
        shape: 'icon', // 아이콘으로 카테고리 표시
        icon: {
          face: 'FontAwesome',
          code: '\uf06c', // FontAwesome 나뭇잎 아이콘
          size: 100, 
          color: category.color
        },
        // 현재 위치가 있으면 사용, 없으면 초기 위치 사용
        x: nodePositions[category.id]?.x || category.x, 
        y: nodePositions[category.id]?.y || category.y, 
        fixed: false,
        font: { size: 20, color: 'black', vadjust: -60, bold: true }
      })),
      // 노드는 flowerIMG로 생성
      ...nodes.map(node => ({
        id: node.id, 
        label: node.name, 
        shape: 'image', 
        image: flowerIMG, 
        size: 50,
        // 현재 위치가 있으면 사용, 없으면 초기 위치 사용
        x: nodePositions[node.id]?.x || node.x, 
        y: nodePositions[node.id]?.y || node.y, 
        fixed: false,
        font: { size: 20, color: 'black', vadjust: -70, bold: true }
      }))
    ];

    // 엣지 설정
    const edgesData = [
      // 카테고리가 상위 카테고리 지정
      ...categories.map(category => {
        if (category.parentCategory) {
          // 해당 상위 카테고리 찾기
          const parentCat = categories.find(cat => cat.name === category.parentCategory);
          // 있으면 해당 상위 카테고리에서 자신으로 이어지는 엣지
          if (parentCat) return { from: parentCat.id, to: category.id };
        }
        // 없거나 상위 카테고리 지정 안하면 earthIMG에서 자신으로 이어지는 엣지
        return { from: 'me', to: category.id };
      }).filter(Boolean),
      // 노드는 자신의 카테고리와 연결
      ...nodes.filter(node => categories.some(cat => cat.name === node.category)).map(node => {
        const category = categories.find(cat => cat.name === node.category);
        return { from: category.id, to: node.id };
      })
    ];

    // vis-network 데이터셋
    const nodesDataSet = new DataSet(nodesData);
    const edgesDataSet = new DataSet(edgesData);
    const data = { nodes: nodesDataSet, edges: edgesDataSet };

    const options = {
      physics: false, // 물리 엔진 비활성화 (자동 이동 X)
      interaction: { 
        dragNodes: true, // 노드 드래그 O
        dragView: false, // 전체 화면 드래그 X
        tooltipDelay: 100, // tooltip 표시 지연 시간 (ms)
        hideEdgesOnDrag: false // 드래그 시 엣지 숨기기 비활성화
      },
      edges: { color: '#507060', width: 3 } // 엣지 설정
    };

    // 기존 네트워크 있으면 제거
    if (networkInstance.current) {
      networkInstance.current.destroy();
    }

    // 새 네트워크 생성
    const network = new Network(networkRef.current, data, options);
    networkInstance.current = network;

    // 드래그 종료 시 위치 업데이트
    network.on('dragEnd', function (params) {
      if (params.nodes.length > 0) {
        updateNodePositions();
      }
    });

    network.on('click', function (params) { // 노드 클릭 시, 실행
      if (params.nodes.length > 0) { // 클릭된 노드의 ID 가져옴
        const nodeId = params.nodes[0];
        network.focus(nodeId, { // 클릭된 노드로 중심 이동 + 확대
          scale: 1.5,
          animation: { duration: 1000, easingFunction: 'easeInOutQuad' }
        });
        // 노드 클릭 시, UserCard 표시
        if (nodes.some(node => node.id === nodeId)) {
          // 클릭 위치에 따라 카드 위치 지정
          const canvasCoords = params.pointer.DOM;
          setCardPosition({ x: canvasCoords.x, y: canvasCoords.y });
          // AddPopup에서 입력한 데이터 전달 + UserCard 표시
          const nodeData = nodes.find(node => node.id === nodeId);
          setClickedNodeData(nodeData);
          setCardVisible(true);
        // 배경이나 카테고리 클릭 시, UserCard 닫기
        } else {
          setCardVisible(false);
          setClickedNodeData(null);
        }
      } else {
        setCardVisible(false);
        setClickedNodeData(null);
      }
    });

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
      }
    };
  }, [categories, nodes, userName, nodePositions]);

  return (
    <div className="main-screen">
      <header className="header">
        <div className="logo-search">
          <h1 className="logo-title">Sa:i</h1>
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search .."
              onKeyDown={(e) => { if (e.key === 'Enter') setSearchVisible(true); }}
            />
            <button onClick={() => setSearchVisible(true)}>
              <Search size={25} color="white" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 pr-8">
          {iconButtons.map(({Icon, path}, idx) => (
            <button
              key={idx}
              onClick={() => navigate(path)}
              className="bg-[#F8F2F0] p-4 rounded-full cursor-pointer flex items-center justify-center hover:bg-[#e6dfdc] transition"
            >
              <Icon size={50} stroke="#507060" strokeWidth={3} className="align-middle"/>
            </button>
          ))}
        </div>
      </header>

      <div className="network-container">
        <div ref={networkRef} className="network-view" />
        <UserCard visible={cardVisible} x={cardPosition.x} y={cardPosition.y} nodeData={clickedNodeData} onNodeUpdate={handleNodeUpdate} onClose={() => setCardVisible(false)} />
      </div>

      <div className="flex items-center justify-start p-4">
        <button
          onClick={() => setPopupVisible(true)}
          className="bg-[#F8F2F0] p-4 rounded-full cursor-pointer flex items-center justify-start hover:bg-[#e6dfdc] transition"
        >
          <SquarePlus size={40} stroke="#507060" strokeWidth={3} className="self-start" />
        </button>
      </div>

      <AddPopup visible={popupVisible} onClose={() => setPopupVisible(false)} onCategoryCreated={handleCategoryCreated} onNodeCreated={handleNodeCreated} existingCategories={categories.map(cat => cat.name)} />
      <SearchPopup visible={searchVisible} onClose={() => setSearchVisible(false)} searchQuery={searchQuery} nodes={nodes} allCategories={categories} />
    </div>
  );
}