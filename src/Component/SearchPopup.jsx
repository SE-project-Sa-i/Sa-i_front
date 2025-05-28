import React, { useState, useEffect } from 'react';
import { Search, SquareX, Star, ChevronRight } from 'lucide-react';

// visible: 보여줄지 여부
// onClose: 팝업 닫기
// searchQuery: 검색어 문자열
// nodes: 검색 대상 노드 목록
// allCategories: 카테고리 정보 (계층구조 처리)
export default function SearchPopup({ visible, onClose, searchQuery, nodes = [], allCategories = [] }) {
  // 검색어 입력
  const [queryText, setQueryText] = useState(typeof searchQuery === 'string' ? searchQuery : '');

  // MainScreen의 검색창의 검색어 바뀔 시, 동기화
  useEffect(() => {
    setQueryText(searchQuery);
  }, [searchQuery]);

  // 이름 검색
  const filteredPeople = nodes.filter((node) =>
    node.name && node.name.toLowerCase().includes(queryText.toLowerCase())
  );

  // Introduction이나 Note의 키워드 검색
  const filteredKeywordNodes = nodes.filter((node) => {
    const query = queryText.toLowerCase();
    return (
      (node.intro && node.intro.toLowerCase().includes(query)) ||
      (node.note && node.note.toLowerCase().includes(query))
    );
  });

  // 카테고리 계층 구조 표시
  const renderCategoryHierarchy = (person) => {
    // 출력할 카테고리 이름 배열
    let categories = []; 
    // person.categories가 배열인지 검사
    if (Array.isArray(person.categories)) { 
      // 배열이면 categories에 할당
      categories = person.categories; 
      // 배열이 아니면, person.categories에 단일 문자열 있는지 검사
    } else if (typeof person.category === 'string') { 
      // 단일 문자열을 계층 경로로 변환 (상위 카테고리 -> 하위 카테고리 경로)
      categories = resolveCategoryPath(person.category, allCategories);
    } else {
      // 둘 다 아니면 단일 항목으로 배열 설정
      categories = ['No Category'];
    }
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap'
      }}>
        {categories.map((category, index) => (
          <React.Fragment key={index}>
            <span style={{
              // 계층에 따라 다른 색
              backgroundColor: index === 0 ? '#3C5146' : index === 1 ? '#507060' : '#85A394',
              color: 'white', padding: '0.25rem 0.5rem', borderRadius: '10px',
              fontSize: '0.8rem', fontWeight: '500'
            }}>
              {category}
            </span>
            {index < categories.length - 1 && (
              // 계층 표시 시, 구분자 나타냄
              <ChevronRight size={20} color="#405E4F" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // 현재 카테고리에서 상위 카테고리까지의 계층 경로 계산
  const resolveCategoryPath = (categoryName, allCategories) => {
    const path = [];
    let current = categoryName;
    while (current) {
      path.unshift(current);
      const match = allCategories.find(cat => cat.name === current);
      current = match?.parentCategory || null;
    }
    return path;
  };

  // not visible이면 null (화면 표시 X)
  if (!visible) return null;

  return (
    <div style={{ // 팝업 바깥 화면
      position: 'fixed', // 스크롤해도 고정
      top: 0, left: 0, right: 0, bottom: 0, // 전체 화면 덮음
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검은 배경
      display: 'flex',
      alignItems: 'center', justifyContent: 'center', // 가운데 정렬
      zIndex: 1000 // 다른 UI 위에 올라오도록
    }}>

      <div style={{ // SearchPopup 화면
        backgroundColor: '#9BB4A0C4', // 배경색
        borderRadius: '20px', // 둥근 모서리
        padding: '3rem', // 내용과 테두리 사이 공간
        width: '900px', // 팝업 너비
        maxHeight: '80vh', // 화면 높이의 80%까지 제한
        overflow: 'auto', // 내용 넘치면 스크롤
        position: 'relative'
      }}>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose} // 버튼 클릭 시, onClose() 실행
          style={{
            position: 'absolute',
            top: '1rem', right: '1rem', // 오른쪽 위 모서리
            backgroundColor: 'transparent', cursor: 'pointer', padding: '1rem',
            border: 'none', // 버튼 테두리 제거 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <SquareX size={45} color="white" />
        </button>

        {/* 타이틀 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'white'
        }}>
          <Search size={40} color="white" />
          <h2 style={{
            margin: 0, fontSize: '2rem', fontWeight: 'bold', fontStyle: 'italic'
          }}>
            Search Result
          </h2>
        </div>

        {/* 검색 결과 */}
        <div style={{
          backgroundColor: '#FFFFFF99', borderRadius: '20px',
          padding: '1.2rem', minHeight: '300px',
        }}>
          
          {/* 이름 검색 결과 */}
          <div style={{ marginBottom: '0rem' }}>
            <div style={{
              display: 'flex', justifyContent: 'flex-end', color: '#353535',
              fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.2rem'  
            }}>
              People
            </div>
            <div style={{
              borderRadius: '20px', padding: '0.8rem'
            }}>
              {filteredPeople.length > 0 ? (
                filteredPeople.map((person) => (
                  <div // 검색 성공
                    key={person.id}
                    style={{
                      backgroundColor: 'white', borderRadius: '20px', padding: '0.8rem',
                      marginBottom: '0.8rem', display: 'flex', alignItems: 'flex-start',
                      gap: '1rem', cursor: 'pointer', transition: 'box-shadow 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    // 마우스 올리면 그림자 짙어짐
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 20px 20px rgba(0,0,0,0.15)';
                    }}
                    // 마우스 안 올리면 그림자 옅어짐
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* 즐겨찾기 표시 */}
                    <div style={{ minWidth: '24px', paddingTop: '0.5rem' }}>
                      <Star
                        size={25}
                        color={person.favorites ? '#FFD700' : 'black'}
                        fill={person.favorites ? '#FFD700' : 'none'}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ // 이름 표시
                        margin: 0, marginBottom: '0.5rem',
                        fontSize: '1.3rem', fontWeight: 'bold'
                      }}>
                        {person.name}
                      </h3>
                      {renderCategoryHierarchy(person)}
                    </div>
                  </div>
                ))
              ) : (
                // 검색 실패
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: '200px', color: 'red', fontSize: '2rem',
                  fontStyle: 'italic', fontWeight: 'bold'
                }}>
                  No People Found
                </div>
              )}
            </div>
          </div>

          {/* 키워드 검색 결과 */}
          <div>
            <div style={{
              display: 'flex', justifyContent: 'flex-end', color: '#353535',
              fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.2rem',
              marginBottom: '0.5rem'
            }}>
              Keyword
            </div>
            <div style={{
              borderRadius: '20px', padding: '0.8rem',
            }}>
              {filteredKeywordNodes.length > 0 ? (
                filteredKeywordNodes.map((person) => (
                  <div // 검색 성공
                    key={person.id}
                    style={{
                      backgroundColor: 'white', borderRadius: '20px', padding: '1rem',
                      marginBottom: '0.8rem', boxShadow: '0 20px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    {/* 이름 표시 */}
                    <h4 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {person.name}
                      {/* 계층 표시 */}
                      <span style={{
                        fontSize: '1rem', color: '#405E4F', display: 'flex',
                        alignItems: 'center', gap: '0.3rem', fontWeight: 'normal'
                      }}>
                        {resolveCategoryPath(person.category, allCategories).map((cat, i, arr) => (
                          <React.Fragment key={i}>
                            {cat}
                            {/* 계층 표시 시, 구분자 나타냄 */}
                            {i < arr.length - 1 && <ChevronRight size={18} color="#405E4F" />}
                          </React.Fragment>
                        ))}
                      </span>
                    </h4>
                    {/* Introduction의 키워드 표시 */}
                    {person.intro?.toLowerCase().includes(queryText.toLowerCase()) && (
                      <p style={{ margin: '0.3rem 0', color: '#405E4F', fontSize: '1rem' }}>
                        <strong>Intro:</strong> {person.intro}
                      </p>
                    )}
                    {/* Note의 키워드 표시 */}
                    {person.note?.toLowerCase().includes(queryText.toLowerCase()) && (
                      <p style={{ margin: '0.3rem 0', color: '#405E4F', fontSize: '1rem' }}>
                        <strong>Note:</strong> {person.note}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                // 검색 실패
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: '200px', color: 'red', fontSize: '2rem',
                  fontStyle: 'italic', fontWeight: 'bold'
                }}>
                  Not Found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}