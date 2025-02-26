type SubHeaderProps = {
  subHeaderTitle: string;
};

export default function SubHeader(props: SubHeaderProps) {
  return <h2 className="text-xl font-bold">{props.subHeaderTitle}</h2>;
}
